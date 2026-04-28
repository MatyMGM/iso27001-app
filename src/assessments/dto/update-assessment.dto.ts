import { IsEnum, IsOptional } from 'class-validator';
import { AssessmentStatus } from '@prisma/client';

export class UpdateAssessmentDto {
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;
}
