import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(domain?: string, tier?: string, framework?: string) {
    const where: Record<string, unknown> = {};
    if (domain) where.domain = domain;
    if (tier === 'free') where.criticality = 'alta';
    where.framework = framework ?? 'iso27001';
    return this.prisma.question.findMany({
      where,
      orderBy: { controlRef: 'asc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException(`Question ${id} not found`);
    return question;
  }
}
