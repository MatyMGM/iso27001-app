import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessments: AssessmentsService) {}

  @Post()
  create(@Body() dto: CreateAssessmentDto) {
    return this.assessments.create(dto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    return this.assessments.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessments.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssessmentDto) {
    return this.assessments.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessments.remove(id);
  }

  @Post(':id/analyze')
  analyze(@Param('id') id: string) {
    return this.assessments.analyze(id);
  }

  @Get(':id/report/pdf')
  @Header('Content-Type', 'application/pdf')
  async reportPdf(@Param('id') id: string, @Res() res: Response) {
    const { buffer, filename } = await this.assessments.generateReportPdf(id);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    res.end(buffer);
  }
}
