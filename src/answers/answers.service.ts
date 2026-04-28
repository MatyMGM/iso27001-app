import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertAnswerDto } from './dto/upsert-answer.dto';
import { BulkUpsertAnswersDto } from './dto/bulk-upsert-answers.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async listForAssessment(assessmentId: string) {
    await this.ensureAssessment(assessmentId);
    return this.prisma.answer.findMany({
      where: { assessmentId },
      include: { question: true },
      orderBy: { question: { controlRef: 'asc' } },
    });
  }

  async upsert(assessmentId: string, dto: UpsertAnswerDto) {
    await this.ensureAssessment(assessmentId);
    await this.ensureQuestion(dto.questionId);

    return this.prisma.answer.upsert({
      where: {
        assessmentId_questionId: { assessmentId, questionId: dto.questionId },
      },
      create: {
        assessmentId,
        questionId: dto.questionId,
        value: dto.value,
        notes: dto.notes,
      },
      update: { value: dto.value, notes: dto.notes },
      include: { question: true },
    });
  }

  async bulkUpsert(assessmentId: string, dto: BulkUpsertAnswersDto) {
    await this.ensureAssessment(assessmentId);

    return this.prisma.$transaction(
      dto.answers.map((a) =>
        this.prisma.answer.upsert({
          where: {
            assessmentId_questionId: { assessmentId, questionId: a.questionId },
          },
          create: {
            assessmentId,
            questionId: a.questionId,
            value: a.value,
            notes: a.notes,
          },
          update: { value: a.value, notes: a.notes },
        }),
      ),
    );
  }

  private async ensureAssessment(id: string) {
    const exists = await this.prisma.assessment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Assessment ${id} not found`);
  }

  private async ensureQuestion(id: string) {
    const exists = await this.prisma.question.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Question ${id} not found`);
  }
}
