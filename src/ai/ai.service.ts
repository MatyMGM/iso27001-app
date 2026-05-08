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

const JSON_SCHEMA = `{
  "overallScore": number,
  "domainScores": { [domain: string]: number },
  "gaps": [
    {
      "control": string,
      "description": string,
      "priority": "alta" | "media" | "baja",
      "recommendation": string
    }
  ],
  "remediationRoadmap": [
    {
      "phase": string,
      "objectives": string[],
      "controls": string[]
    }
  ],
  "executiveSummary": string
}`;

const SYSTEM_PROMPTS: Record<string, string> = {
  iso27001: `Eres un Lead Auditor ISO/IEC 27001:2022 con experiencia en auditorías de certificación.
Analizarás las respuestas de una autoevaluación contra los 93 controles del Anexo A y devolverás un único reporte ejecutivo en español.

Reglas de salida (estrictas):
- Devuelve SOLAMENTE JSON válido, sin texto previo o posterior, sin bloques de código y sin comentarios.
- El JSON debe seguir exactamente este esquema:
  ${JSON_SCHEMA}
- overallScore: madurez global ponderada (0-100).
- domainScores: puntaje por dominio del Anexo A (A.5, A.6, A.7, A.8).
- gaps: controles respondidos NO o PARCIAL, priorizados.
- remediationRoadmap: fases "Fase 1 - 0-30 días", "Fase 2 - 30-90 días", etc.
- executiveSummary: 2-4 párrafos en español neutro, tono ejecutivo.
- Todos los textos visibles deben estar en español neutro.
- No inventes controles que no aparezcan en las respuestas entregadas.`,

  soc2: `Eres un auditor certificado SOC 2 (CPA/CISA) con experiencia en auditorías de Trust Service Criteria del AICPA.
Analizarás las respuestas de una autoevaluación contra los Trust Service Criteria (TSC) de SOC 2 y devolverás un único reporte ejecutivo en español.

Reglas de salida (estrictas):
- Devuelve SOLAMENTE JSON válido, sin texto previo o posterior, sin bloques de código y sin comentarios.
- El JSON debe seguir exactamente este esquema:
  ${JSON_SCHEMA}
- overallScore: madurez global ponderada (0-100).
- domainScores: puntaje por criterio TSC (Criterios Comunes, Disponibilidad, Confidencialidad, Integridad de Procesamiento, Privacidad).
- gaps: criterios respondidos NO o PARCIAL, priorizados por impacto en la opinión del auditor.
- remediationRoadmap: fases "Fase 1 - 0-30 días", "Fase 2 - 30-90 días", "Fase 3 - 90-180 días".
- executiveSummary: 2-4 párrafos en español neutro describiendo el nivel de preparación para una auditoría SOC 2 Type II.
- Todos los textos visibles deben estar en español neutro.
- No inventes criterios que no aparezcan en las respuestas entregadas.`,

  cis: `Eres un especialista en CIS Controls v8 con experiencia en implementación de controles de ciberseguridad.
Analizarás las respuestas de una autoevaluación contra los CIS Controls v8 agrupados por Implementation Groups (IG) y devolverás un único reporte ejecutivo en español.

Reglas de salida (estrictas):
- Devuelve SOLAMENTE JSON válido, sin texto previo o posterior, sin bloques de código y sin comentarios.
- El JSON debe seguir exactamente este esquema:
  ${JSON_SCHEMA}
- overallScore: madurez global ponderada (0-100).
- domainScores: puntaje por Implementation Group (IG1 - Básico, IG2 - Intermedio, IG3 - Avanzado).
- gaps: salvaguardas respondidas NO o PARCIAL, priorizadas por Implementation Group.
- remediationRoadmap: fases "Fase 1 - IG1 inmediato (0-30 días)", "Fase 2 - IG1 completo (30-90 días)", "Fase 3 - IG2 (90-180 días)", "Fase 4 - IG3 (180+ días)".
- executiveSummary: 2-4 párrafos en español neutro describiendo el nivel de madurez CIS y el IG alcanzable.
- Todos los textos visibles deben estar en español neutro.
- No inventes salvaguardas que no aparezcan en las respuestas entregadas.`,
};

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const framework = ((assessment as any).framework as string) ?? 'iso27001';
    const systemPrompt = SYSTEM_PROMPTS[framework] ?? SYSTEM_PROMPTS.iso27001;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allQuestions = await this.prisma.question.findMany({
      where: { framework } as any,
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

    const frameworkLabel: Record<string, string> = {
      iso27001: 'ISO/IEC 27001:2022 Anexo A',
      soc2: 'SOC 2 Trust Service Criteria (AICPA)',
      cis: 'CIS Controls v8',
    };

    const userPrompt = `Empresa: ${assessment.company.name}${
      assessment.company.industry ? ` (industria: ${assessment.company.industry})` : ''
    }${assessment.company.size ? ` (tamaño: ${assessment.company.size})` : ''}.
Marco de evaluación: ${frameworkLabel[framework] ?? framework}.

Respuestas del cuestionario (${allQuestions.length} controles; ${assessment.answers.length} respondidos, ${unansweredCount} sin respuesta y considerados NO implementados):
${formattedAnswers}

Genera el reporte JSON según el esquema indicado.`;

    const groq = new Groq({ apiKey });

    let report: unknown;
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
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
