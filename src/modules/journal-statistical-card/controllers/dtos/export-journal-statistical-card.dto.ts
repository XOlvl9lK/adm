// eslint-disable-next-line max-len
import { FindJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/find-journal-statistical-card.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ExportJournalStatisticalCardDto extends FindJournalStatisticalCardDto {
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
  @IsString({ each: true })
  timeZone: string;

  @ApiProperty({
    description: 'Пользователь, сформировавший выгрузку',
  })
  @IsString()
  viewer: string;
}
