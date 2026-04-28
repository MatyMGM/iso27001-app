import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  @Get()
  findAll(@Query('domain') domain?: string) {
    return this.questions.findAll(domain);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questions.findOne(id);
  }
}
