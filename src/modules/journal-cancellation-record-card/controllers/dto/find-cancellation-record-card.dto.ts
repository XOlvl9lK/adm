import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { OperationTypeTitleEnum } from '../../domain/operation-type-title.enum';
import { FormNumberEnum } from '../../domain/form-number.enum';
import { Transform } from 'class-transformer';

export class FindCancellationRecordCardDto extends ListRequestDto {
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
    description: 'Наименования мер реагирования',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsString({ each: true })
  responseMeasureTitles?: string[];

  @ApiProperty({
    description: 'Номер проверки',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  uniqueNumber?: string;

  @ApiProperty({
    description: 'Дата и время операции',
    example: [new Date().toISOString(), new Date().toISOString()],
    nullable: true,
  })
  @IsOptional()
  operationDate?: [string, string];

  @ApiProperty({
    description: 'Вид операции',
    enum: OperationTypeTitleEnum,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(OperationTypeTitleEnum, { each: true })
  operationTypeTitle?: OperationTypeTitleEnum[];

  @ApiProperty({
    description: 'Номер формы',
    enum: FormNumberEnum,
    isArray: true,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(FormNumberEnum, { each: true })
  formNumber?: FormNumberEnum[];

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
