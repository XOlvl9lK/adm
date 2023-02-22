import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/find-journal-cancellation-statistical-card.dto';

export class ExportJournalCancellationStatisticalCardDto extends FindJournalCancellationStatisticalCardDto {
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
