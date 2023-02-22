import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindCancellationKuspDto } from './find-cancellation-kusp.dto';

export class ExportCancellationKuspDto extends FindCancellationKuspDto {
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
