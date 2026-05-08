import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum AssessmentTypeEnum {
  free = 'free',
  profesional = 'profesional',
  premium = 'premium',
}

export enum AssessmentFrameworkEnum {
  iso27001 = 'iso27001',
  soc2 = 'soc2',
  cis = 'cis',
}

export class CreateAssessmentDto {
  @IsString()
  companyId: string;

  @IsOptional()
  @IsEnum(AssessmentTypeEnum)
  type?: AssessmentTypeEnum;

  @IsOptional()
  @IsEnum(AssessmentFrameworkEnum)
  framework?: AssessmentFrameworkEnum;
}
