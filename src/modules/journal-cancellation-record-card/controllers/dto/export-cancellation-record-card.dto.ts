import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { FindCancellationRecordCardDto } from './find-cancellation-record-card.dto';

export class ExportCancellationRecordCardDto extends FindCancellationRecordCardDto {
  @ApiProperty({
    description: 'Ids записей для экспорта',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids?: string[];

  @ApiProperty({
    description: 'Ключи колонок',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columnKeys: string[];

  @ApiProperty({
    description: 'Тайм зона юзера на фронте',
  })
  @IsString()
  timeZone: string;

  @ApiProperty({
    description: 'Пользователь, сформировавший выгрузку',
  })
  @IsString()
  viewer: string;
}
