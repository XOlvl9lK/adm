import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { OperationTypeEnum } from '@modules/journal-cancellation-statistical-card/domain/operation-type.enum';
import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { Transform } from 'class-transformer';

export class FindJournalCancellationStatisticalCardDto extends ListRequestDto {
  @ApiProperty({
    description: 'Наименования ведомства',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  departmentTitles?: string[];

  @ApiProperty({
    description: 'Наименования региона',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  regionTitles?: string[];

  @ApiProperty({
    description: 'Наименования подразделений',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  divisionTitles?: string[];

  @ApiProperty({
    description: 'наименования надзирающих прокуратур',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  procuracyTitles?: string[];

  @ApiProperty({
    description: 'Диапазон дат',
    example: [new Date().getTime(), new Date().getTime()],
    required: false,
  })
  @IsOptional()
  operationDate?: [string, string];

  @ApiProperty({
    description: 'ИКУД',
    required: false,
  })
  @IsOptional()
  @IsString()
  ikud?: string;

  @ApiProperty({
    description: 'Идентификатор карточки',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({
    description: 'Результат обработки',
    required: false,
    enum: OperationTypeEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(OperationTypeEnum, { each: true })
  operationTypeTitle?: OperationTypeEnum[];

  @ApiProperty({
    description: 'Результат обработки',
    required: false,
    enum: FormNumberEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FormNumberEnum, { each: true })
  formNumber?: FormNumberEnum[];

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
