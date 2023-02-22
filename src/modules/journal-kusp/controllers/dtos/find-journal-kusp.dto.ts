import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { StatusEnum } from '@modules/journal-kusp/domain/status.enum';
import { Transform } from 'class-transformer';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';
import { SourceEnum } from '@modules/journal-kusp/domain/source.enum';
import { ListRequestDto } from '@common/utils/types';

export class FindJournalKuspDto extends ListRequestDto {
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
  startProcessingDate?: [string, string];

  @ApiProperty({
    description: 'Массив статусов',
    required: false,
    enum: StatusEnum,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StatusEnum, { each: true })
  statuses?: StatusEnum[];

  @ApiProperty({
    description: 'Массив видов пакетов',
    required: false,
    enum: PackageTypeEnum,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PackageTypeEnum, { each: true })
  packageTypes?: PackageTypeEnum[];

  @ApiProperty({
    description: 'Массив источников',
    required: false,
    enum: SourceEnum,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SourceEnum, { each: true })
  sources?: SourceEnum[];

  @ApiProperty({
    description: 'Наименование пакета',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileTitle?: string;

  @ApiProperty({
    description: 'Номер КУСП',
    required: false,
  })
  @IsOptional()
  @IsString()
  kuspNumber?: string;

  @ApiProperty({
    description: 'Фамилия подписанта',
    required: false,
  })
  @IsOptional()
  @IsString()
  signerName?: string;

  @ApiProperty({
    description: 'Оператор',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorLogin?: string;

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
