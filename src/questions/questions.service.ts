import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(domain?: string) {
    return this.prisma.question.findMany({
      where: domain ? { domain } : undefined,
      orderBy: { controlRef: 'asc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException(`Question ${id} not found`);
    return question;
  }
}
