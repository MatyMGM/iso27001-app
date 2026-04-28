import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    CompaniesModule,
    AssessmentsModule,
    QuestionsModule,
    AnswersModule,
    AiModule,
  ],
})
export class AppModule {}
