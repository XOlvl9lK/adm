import { SortQuery } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

enum FormatEnum {
  XLSX = 'xlsx',
  XLS = 'xls',
  ODS = 'ods',
}
export class ExportStatusHistoryDto {
  @ApiProperty({
    description: 'Ids записей для экспорта',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'таймзона клиента',
    required: false,
  })
  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsEnum(FormatEnum)
  format: FormatEnum;

  @ApiProperty({
    description: 'Сортировка',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'object' ? value : JSON.parse(value)))
  @IsObject()
  sort?: SortQuery;
}
