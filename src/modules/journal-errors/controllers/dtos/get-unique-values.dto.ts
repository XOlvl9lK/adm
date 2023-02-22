import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUniqueValuesDto implements GetFieldUniqueValues {
  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  query?: string;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  size: number;
}
