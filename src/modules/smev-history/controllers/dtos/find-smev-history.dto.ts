import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { SmevHistoryStateEnum } from '@modules/smev-history/domain/smev-history-state.enum';
import { SmevMethodNameEnum } from '@modules/smev-history/domain/smev-method-name.enum';
import { Transform } from 'class-transformer';

export class FindSmevHistoryDto extends ListRequestDto {
  @ApiProperty({
    description: 'Наименование внешнего ОВ',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departmentName?: string[];

  @ApiProperty({
    description: 'Статус запроса',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SmevHistoryStateEnum, { each: true })
  state?: SmevHistoryStateEnum[];

  @ApiProperty({
    description: 'Дата и время начала',
    required: false,
  })
  @Transform(({ value }) => {
    if (!value || !value?.length || value?.every((d) => `${d}` === 'null' || `${d}` === 'undefined'))
      return undefined;
    return value.map((d) => (d === 'null' || d === 'undefined' ? JSON.parse(d) : d));
  })
  @IsOptional()
  createDate?: [string, string];

  @ApiProperty({
    description: 'Дата и время окончания',
    required: false,
  })
  @Transform(({ value }) => {
    if (!value || !value.length || value.every((d) => d.toString() === 'null' || d.toString() === 'undefined'))
      return undefined;
    return value.map((d) => (d === 'null' || d === 'undefined' ? JSON.parse(d) : d));
  })
  @IsOptional()
  updateDate?: [string, string];

  @ApiProperty({
    required: false,
    description: 'Тип запроса',
  })
  @IsOptional()
  @IsEnum(SmevMethodNameEnum, { each: true })
  methodName?: SmevMethodNameEnum[];
}
