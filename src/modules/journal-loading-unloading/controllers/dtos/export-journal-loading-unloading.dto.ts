// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/find-journal-loading-unloading.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ExportJournalLoadingUnloadingDto extends FindJournalLoadingUnloadingDto {
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
