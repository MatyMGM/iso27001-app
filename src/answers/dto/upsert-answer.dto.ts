import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AnswerValue } from '@prisma/client';

export class UpsertAnswerDto {
  @IsString()
  questionId: string;

  @IsEnum(AnswerValue)
  value: AnswerValue;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
