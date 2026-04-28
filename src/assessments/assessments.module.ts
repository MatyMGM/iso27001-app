import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { AiModule } from '../ai/ai.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [AiModule, PdfModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
