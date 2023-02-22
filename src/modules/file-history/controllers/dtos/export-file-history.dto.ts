import { ExportFileHistory } from '@modules/file-history/services/export-file-history.service';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsArray, IsString, IsNumber } from 'class-validator';
import { FindFileHistoryDto } from './find-file-history.dto';

export class ExportFileHistoryDto extends FindFileHistoryDto implements ExportFileHistory {
  @ApiProperty({
    description: 'Ids записей для экспорта',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  ids?: number[];

  @ApiProperty({
    description: 'Ключи колонок',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  columnKeys?: string[];

  @ApiProperty({
    description: 'Часовой пояс',
  })
  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  viewer?: string;
}
