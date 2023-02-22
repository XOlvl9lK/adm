import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProcessingResultEnum } from '@modules/journal-loading-unloading/domain/processing-result.enum';
import { ListRequestDto } from '@common/utils/types';

export enum ShowEnum {
  LOAD = 'LOAD',
  UNLOAD = 'UNLOAD',
}

export const ShowEnumTranslated = {
  [ShowEnum.LOAD]: 'Загрузка',
  [ShowEnum.UNLOAD]: 'Выгрузка',
};

export class FindJournalLoadingUnloadingDto extends ListRequestDto {
  @ApiProperty({
    description: 'Диапазон дат',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  exportDate?: [string, string];

  @ApiProperty({
    description: 'Диапазон дат',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  importDate?: [string, string];

  @ApiProperty({
    description: 'Наименование файла',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileTitle?: string;

  @ApiProperty({
    description: 'Результат обработки',
    required: false,
    enum: ProcessingResultEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ProcessingResultEnum, { each: true })
  processingResult?: ProcessingResultEnum[];

  @IsOptional()
  @IsEnum(ShowEnum, { each: true })
  show?: ShowEnum[];
}
