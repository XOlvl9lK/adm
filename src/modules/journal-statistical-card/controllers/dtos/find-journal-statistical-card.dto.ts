import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { StatisticalCardSourceEnum } from '@modules/journal-statistical-card/domain/statistical-card-source.enum';
import { StatisticalCardStatusEnum } from '@modules/journal-statistical-card/domain/statistical-card-status.enum';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';
import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { Transform } from 'class-transformer';

export class FindJournalStatisticalCardDto extends ListRequestDto {
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
    description: 'Дата и время нагрузки',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  startProcessingDate?: [string, string];

  @ApiProperty({
    description: 'ИКУД',
    required: false,
  })
  @IsOptional()
  @IsString()
  ikud?: string;

  @ApiProperty({
    description: 'Статус',
    required: false,
    enum: StatisticalCardStatusEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StatisticalCardStatusEnum, { each: true })
  statusTitle?: StatisticalCardStatusEnum[];

  @ApiProperty({
    description: 'Дата присвоения статуса',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  statusDate?: [string, string];

  @ApiProperty({
    description: 'Идентификатор карточки',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({
    description: 'Вид карты',
    required: false,
    enum: PackageTypeEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PackageTypeEnum, { each: true })
  cardType?: PackageTypeEnum[];

  @ApiProperty({
    description: 'Вид карты',
    required: false,
    enum: StatisticalCardSourceEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StatisticalCardSourceEnum, { each: true })
  sourceTitle?: StatisticalCardSourceEnum[];

  @ApiProperty({
    description: 'Вид карты',
    required: false,
    enum: FormNumberEnum,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FormNumberEnum, { each: true })
  formNumber?: FormNumberEnum[];

  @ApiProperty({
    description: 'Идентификатор карточки',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorLogin?: string;

  @ApiProperty({
    description: 'Внесены изменения прокурором',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ each: true })
  isProsecutorChange?: boolean[];

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
