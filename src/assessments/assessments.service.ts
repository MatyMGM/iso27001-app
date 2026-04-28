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

    return this.prisma.assessment.create({
      data: { companyId: dto.companyId },
    });
  }

  findAll(companyId?: string) {
    return this.prisma.assessment.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { company: true },
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
    return this.prisma.assessment.update({ where: { id }, data: dto });
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
      include: { company: true },
    });
    if (!assessment) throw new NotFoundException(`Assessment ${id} not found`);

    let report = assessment.aiReport as Record<string, unknown> | null;
    if (!report) {
      report = (await this.ai.analyzeAssessment(id)) as Record<string, unknown>;
    }

    const payload: ReportPayload = {
      companyName: assessment.company.name,
      generatedAt: new Date(),
      overallScore: Number(report.overallScore ?? 0),
      domainScores: (report.domainScores as Record<string, number>) ?? {},
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
    };

    const buffer = await this.pdf.generateAssessmentPdf(payload);
    const safeName = assessment.company.name
      .normalize('NFKD')
      .replace(/[^\w\s.-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const filename = `iso27001-${safeName || 'reporte'}-${id.slice(0, 8)}.pdf`;
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
