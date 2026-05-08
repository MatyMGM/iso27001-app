import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AiService } from '../ai/ai.service';
import {
  PdfService,
  ReportGap,
  ReportPayload,
  ReportPhase,
} from '../pdf/pdf.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly pdf: PdfService,
  ) {}

  async create(dto: CreateAssessmentDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
      select: { id: true },
    });
    if (!company) throw new NotFoundException(`Company ${dto.companyId} not found`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.assessment.create({
      data: {
        companyId: dto.companyId,
        type: dto.type ?? 'premium',
        framework: dto.framework ?? 'iso27001',
      } as any,
    });
  }

  findAll(companyId?: string) {
    return this.prisma.assessment.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });
  }

  findByUser(userId: string) {
    return this.prisma.assessment.findMany({
      where: { company: { userId } },
      orderBy: { createdAt: 'asc' },
      include: {
        company: true,
        answers: { include: { question: true }, orderBy: { question: { controlRef: 'asc' } } },
      },
    });
  }

  async findOne(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        company: true,
        answers: {
          include: { question: true },
          orderBy: { question: { controlRef: 'asc' } },
        },
      },
    });
    if (!assessment) throw new NotFoundException(`Assessment ${id} not found`);
    return assessment;
  }

  async update(id: string, dto: UpdateAssessmentDto) {
    await this.ensureExists(id);
    const updated = await this.prisma.assessment.update({ where: { id }, data: dto });
    if (dto.status === 'completed') {
      await this.computeAndSaveScore(id);
    }
    return updated;
  }

  async getBenchmark() {
    const assessments = await this.prisma.assessment.findMany({
      where: { benchmarkConsent: true, status: { in: ['completed', 'analyzed'] } },
      select: {
        computedScore: true,
        aiReport: true,
        answers: { select: { value: true, question: { select: { domain: true } } } },
      },
    });

    if (assessments.length === 0) {
      return { totalAssessments: 0, avgOverallScore: 0, avgByDomain: [], scoreDistribution: [] };
    }

    const scores: number[] = [];
    const domainTotals: Record<string, { sum: number; count: number }> = {};

    for (const a of assessments) {
      let score: number | null = null;
      const report = a.aiReport as Record<string, unknown> | null;
      if (report?.overallScore !== undefined) {
        score = Math.round(Number(report.overallScore));
      } else if (a.computedScore !== null && a.computedScore !== undefined) {
        score = Math.round(a.computedScore);
      } else if (a.answers.length > 0) {
        const counted = a.answers.filter((ans) => ans.value !== 'na');
        if (counted.length > 0) {
          const weights: Record<string, number> = { yes: 1, partial: 0.5, no: 0, na: 0 };
          const sum = counted.reduce((acc, ans) => acc + (weights[ans.value] ?? 0), 0);
          score = Math.round((sum / counted.length) * 100);
        }
      }
      if (score !== null) scores.push(score);

      for (const ans of a.answers) {
        if (ans.value === 'na' || !ans.question?.domain) continue;
        const d = ans.question.domain;
        if (!domainTotals[d]) domainTotals[d] = { sum: 0, count: 0 };
        const w: Record<string, number> = { yes: 1, partial: 0.5, no: 0, na: 0 };
        domainTotals[d].sum += w[ans.value] ?? 0;
        domainTotals[d].count += 1;
      }
    }

    const avgOverallScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const avgByDomain = Object.entries(domainTotals).map(([domain, { sum, count }]) => ({
      domain,
      avg: Math.round((sum / count) * 100),
    }));

    const brackets = [
      { label: '0–25%', min: 0, max: 25 },
      { label: '26–50%', min: 26, max: 50 },
      { label: '51–75%', min: 51, max: 75 },
      { label: '76–100%', min: 76, max: 100 },
    ];
    const scoreDistribution = brackets.map(({ label, min, max }) => ({
      label,
      count: scores.filter((s) => s >= min && s <= max).length,
    }));

    return { totalAssessments: assessments.length, avgOverallScore, avgByDomain, scoreDistribution };
  }

  private async computeAndSaveScore(id: string): Promise<void> {
    const answers = await this.prisma.answer.findMany({
      where: { assessmentId: id },
      select: { value: true },
    });
    const counted = answers.filter((a) => a.value !== 'na');
    if (counted.length === 0) return;
    const weights: Record<string, number> = { yes: 1, partial: 0.5, no: 0, na: 0 };
    const sum = counted.reduce((acc, a) => acc + (weights[a.value] ?? 0), 0);
    const score = Math.round((sum / counted.length) * 100);
    await this.prisma.assessment.update({ where: { id }, data: { computedScore: score } });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.assessment.delete({ where: { id } });
  }

  async analyze(id: string) {
    await this.ensureExists(id);
    return this.ai.analyzeAssessment(id);
  }

  async generateReportPdf(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: { company: true, answers: { include: { question: true } } },
    });
    if (!assessment) throw new NotFoundException(`Assessment ${id} not found`);

    let report = assessment.aiReport as Record<string, unknown> | null;
    if (!report) {
      report = (await this.ai.analyzeAssessment(id)) as Record<string, unknown>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const framework = ((assessment as any).framework as string) ?? 'iso27001';

    // Compute score matching the frontend: answered answers + unanswered questions as "no"
    const allQuestions = await this.prisma.question.findMany({
      where: { framework },
      select: { id: true, domain: true },
    });
    const answeredIds = new Set(assessment.answers.map((a) => a.questionId));
    const weights: Record<string, number | null> = { yes: 1, partial: 0.5, no: 0, na: null };

    const fullAnswers: { value: string; domain: string }[] = [
      ...assessment.answers
        .filter((a) => a.question)
        .map((a) => ({ value: a.value, domain: a.question!.domain })),
      ...allQuestions
        .filter((q) => !answeredIds.has(q.id))
        .map((q) => ({ value: 'no', domain: q.domain })),
    ];
    const counted = fullAnswers.filter((a) => weights[a.value] !== null);
    const overallScore = counted.length === 0
      ? 0
      : Math.round((counted.reduce((acc, a) => acc + (weights[a.value] as number), 0) / counted.length) * 100);

    const domainMap: Record<string, { sum: number; count: number }> = {};
    for (const a of counted) {
      if (!domainMap[a.domain]) domainMap[a.domain] = { sum: 0, count: 0 };
      domainMap[a.domain].sum += weights[a.value] as number;
      domainMap[a.domain].count += 1;
    }
    const domainScores: Record<string, number> = {};
    for (const [domain, { sum, count }] of Object.entries(domainMap)) {
      domainScores[domain] = Math.round((sum / count) * 100);
    }

    const payload: ReportPayload = {
      companyName: assessment.company.name,
      generatedAt: new Date(),
      overallScore,
      domainScores,
      gaps: ((report.gaps as ReportGap[]) ?? []).map((g) => ({
        control: String(g.control ?? ''),
        description: String(g.description ?? ''),
        priority: String(g.priority ?? 'baja'),
        recommendation: String(g.recommendation ?? ''),
      })),
      remediationRoadmap: ((report.remediationRoadmap as ReportPhase[]) ?? []).map(
        (ph) => ({
          phase: String(ph.phase ?? ''),
          objectives: Array.isArray(ph.objectives) ? ph.objectives.map(String) : [],
          controls: Array.isArray(ph.controls) ? ph.controls.map(String) : [],
        }),
      ),
      executiveSummary: String(report.executiveSummary ?? ''),
      framework,
    };

    const buffer = await this.pdf.generateAssessmentPdf(payload);
    const safeName = assessment.company.name
      .normalize('NFKD')
      .replace(/[^\w\s.-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const filename = `${framework}-${safeName || 'reporte'}-${id.slice(0, 8)}.pdf`;
    return { buffer, filename };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.assessment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Assessment ${id} not found`);
  }
}
