import { IsString } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  companyId: string;
}
