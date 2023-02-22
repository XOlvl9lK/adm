import { FindSmevHistoryDto } from '@modules/smev-history/controllers/dtos/find-smev-history.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExportSmevHistoryDto extends FindSmevHistoryDto {
  @ApiProperty({
    description: 'Ids записей для экспорта',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  ids?: number[];

  @ApiProperty({
    description: 'Ключи колонок',
  })
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
