import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import { PrismaService } from '../prisma/prisma.service';

const ANSWER_LABEL: Record<string, string> = {
  yes: 'YES',
  partial: 'PARTIAL',
  no: 'NO',
  na: 'N/A',
};

const SYSTEM_PROMPT = `Eres un Lead Auditor ISO/IEC 27001:2022 con experiencia en auditorías de certificación.
Analizarás las respuestas de una autoevaluación contra los 93 controles del Anexo A y devolverás un único reporte ejecutivo en español.

Reglas de salida (estrictas):
- Devuelve SOLAMENTE JSON válido, sin texto previo o posterior, sin bloques de código y sin comentarios.
- El JSON debe seguir exactamente este esquema:
  {
    "overallScore": number,                // 0-100, madurez global ponderada
    "domainScores": { [domain: string]: number }, // 0-100 por dominio del Anexo A
    "gaps": [
      {
        "control": string,                 // ej. "A.5.1"
        "description": string,             // qué falta o es parcial, en español
        "priority": "alta" | "media" | "baja",
        "recommendation": string           // acción concreta y accionable, en español
      }
    ],
    "remediationRoadmap": [
      {
        "phase": string,                   // "Fase 1 - 0-30 días", etc.
        "objectives": string[],            // objetivos en español
        "controls": string[]               // refs de controles, ej. "A.5.1"
      }
    ],
    "executiveSummary": string             // 2-4 párrafos en español, tono ejecutivo
  }
- Todos los textos visibles (descripciones, recomendaciones, fases, resumen) deben estar en español neutro.
- Prioriza los controles críticos respondidos como NO o PARCIAL.
- No inventes controles que no aparezcan en las respuestas entregadas.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async analyzeAssessment(assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        company: true,
        answers: {
          include: { question: true },
          orderBy: { question: { controlRef: 'asc' } },
        },
      },
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment ${assessmentId} not found`);
    }

    if (assessment.aiReport && assessment.status === 'analyzed') {
      return assessment.aiReport;
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GROQ_API_KEY is not configured');
    }

    const allQuestions = await this.prisma.question.findMany({
      orderBy: { controlRef: 'asc' },
    });
    const answerByQuestionId = new Map(
      assessment.answers.map((a) => [a.questionId, a]),
    );

    let unansweredCount = 0;
    const formattedAnswers = allQuestions
      .map((q) => {
        const a = answerByQuestionId.get(q.id);
        if (!a) {
          unansweredCount += 1;
          return `[${q.controlRef}] ${q.controlName}: NO — sin respuesta registrada (tratado como no implementado)`;
        }
        const label = ANSWER_LABEL[a.value] ?? a.value.toUpperCase();
        const comment = a.notes?.trim() ? a.notes.trim() : 'sin comentario';
        return `[${q.controlRef}] ${q.controlName}: ${label} — ${comment}`;
      })
      .join('\n');

    const userPrompt = `Empresa: ${assessment.company.name}${
      assessment.company.industry ? ` (industria: ${assessment.company.industry})` : ''
    }${assessment.company.size ? ` (tamaño: ${assessment.company.size})` : ''}.

Respuestas del cuestionario (${allQuestions.length} controles del Anexo A; ${assessment.answers.length} respondidos, ${unansweredCount} sin respuesta y considerados NO implementados):
${formattedAnswers}

Genera el reporte JSON según el esquema indicado.`;

    const groq = new Groq({ apiKey });

    let report: unknown;
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      });
      const text = completion.choices[0]?.message?.content ?? '';
      report = JSON.parse(text);
    } catch (err) {
      this.logger.error('Groq analysis failed', err as Error);
      throw new InternalServerErrorException(
        'Failed to generate AI report from Groq',
      );
    }

    await this.prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        aiReport: report as object,
        status: 'analyzed',
      },
    });

    return report;
  }
}
