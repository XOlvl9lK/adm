import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, ValidateIf } from 'class-validator';
import { OperationTypeTitleEnum } from '../../domain/operation-type-title.enum';
import { Transform } from 'class-transformer';

export class FindCancellationKuspDto extends ListRequestDto {
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
    description: 'Дата и время операции',
    example: [new Date().toISOString(), new Date().toISOString()],
    nullable: true,
  })
  @IsOptional()
  operationDate?: [string, string];

  @ApiProperty({
    description: '№ КУСП',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  kuspNumber?: string;

  @ApiProperty({
    description: 'Вид операции',
    nullable: true,
    isArray: true,
    enum: OperationTypeTitleEnum,
  })
  @IsOptional()
  @IsEnum(OperationTypeTitleEnum, { each: true })
  operationTypeTitle?: OperationTypeTitleEnum[];

  @ApiProperty({
    description: 'Пользователь',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  userLogin?: string;

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
