import { ListRequestDto } from '@common/utils/types';
import { EntityTypeTitleEnum } from '@modules/journal-typical-violation/domain/entity-type-title.enum';
import { FormNumberEnum } from '@modules/journal-typical-violation/domain/form-number.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, ValidateIf, IsBoolean } from 'class-validator';
import { OperationTypeTitleEnum } from '../../domain/operation-type-title.enum';
import { Transform } from 'class-transformer';
import { ExaminationTypeEnum } from '@modules/journal-typical-violation/domain/examination-type.enum';

export class FindTypicalViolationDto extends ListRequestDto {
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
    description: 'Идентификатор карточки',
  })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({
    description: 'Дата версии (период от и до)',
    example: [new Date().toString(), new Date().toString()],
    required: false,
  })
  @IsOptional()
  versionDate?: [string, string];

  @ApiProperty({
    description: 'Номер формы',
  })
  @IsOptional()
  @IsEnum(FormNumberEnum, { each: true })
  formNumber?: FormNumberEnum[];

  @ApiProperty({
    description: 'Вид сущности',
  })
  @IsOptional()
  @IsEnum(EntityTypeTitleEnum, { each: true })
  entityTypeTitle?: EntityTypeTitleEnum[];

  @ApiProperty({
    description: 'Наименование типовой проверки',
    isArray: true,
  })
  @IsOptional()
  @IsEnum(ExaminationTypeEnum, { each: true })
  examinationTypeTitle?: ExaminationTypeEnum[];

  @ApiProperty({
    description: 'Вид действия',
  })
  @IsOptional()
  @IsEnum(OperationTypeTitleEnum, { each: true })
  operationTypeTitle?: OperationTypeTitleEnum[];

  @ApiProperty({
    description: 'Дата и время операции (период от и до)',
    example: [new Date().toString(), new Date().toString()],
    required: false,
  })
  @IsOptional()
  operationDate?: [string, string];

  @ApiProperty({
    description: 'Пользователь',
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
