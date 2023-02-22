import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ExportSpvHistory } from '../../services/export-spv-history.service';
import { FindSpvHistoryDto } from './find-spv-history.dto';

export class ExportSpvHistoryDto extends FindSpvHistoryDto implements ExportSpvHistory {
  @ApiProperty({
    description: 'Ids записей для экспорта',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @ApiProperty({
    description: 'Ключи колонок',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columnKeys?: string[];

  @ApiProperty({
    description: 'Временная зона',
  })
  @IsOptional()
  @IsString()
  timeZone?: string;

  @ApiProperty({
    description: 'Пользователь, сформировавший выгрузку',
  })
  @IsString()
  viewer: string;
}
