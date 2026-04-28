import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { UpsertAnswerDto } from './dto/upsert-answer.dto';
import { BulkUpsertAnswersDto } from './dto/bulk-upsert-answers.dto';

@Controller('assessments/:assessmentId/answers')
export class AnswersController {
  constructor(private readonly answers: AnswersService) {}

  @Get()
  list(@Param('assessmentId') assessmentId: string) {
    return this.answers.listForAssessment(assessmentId);
  }

  @Put()
  upsert(@Param('assessmentId') assessmentId: string, @Body() dto: UpsertAnswerDto) {
    return this.answers.upsert(assessmentId, dto);
  }

  @Post('bulk')
  bulk(@Param('assessmentId') assessmentId: string, @Body() dto: BulkUpsertAnswersDto) {
    return this.answers.bulkUpsert(assessmentId, dto);
  }
}
