import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpsertAnswerDto } from './upsert-answer.dto';

export class BulkUpsertAnswersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertAnswerDto)
  answers: UpsertAnswerDto[];
}
