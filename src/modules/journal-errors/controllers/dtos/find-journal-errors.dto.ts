import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ErrorTypeEnum } from '@modules/journal-errors/domain/error-type.enum';
import { SiteSectionEnum } from '@modules/journal-errors/domain/site-section.enum';
import { Transform } from 'class-transformer';

export class FindJournalErrorsDto extends ListRequestDto {
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
    description: 'Компонент/раздел ГАС ПС',
    required: false,
  })
  @IsOptional()
  @IsEnum(SiteSectionEnum, { each: true })
  siteSectionTitle?: SiteSectionEnum[];

  @ApiProperty({
    description: 'IP адрес клиента',
    required: false,
    enum: ErrorTypeEnum,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(ErrorTypeEnum, { each: true })
  errorTypeTitle?: ErrorTypeEnum[];

  @ApiProperty({
    description: 'Имя пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  userLogin?: string;

  @ApiProperty({
    description: 'IP адрес клиента',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'Диапазон дат',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  eventDate?: [string, string];

  @ValidateIf((dto) => Boolean(dto.divisionTitles))
  @Transform(({ obj }) => Boolean(obj.divisionTitles))
  @IsBoolean()
  userHasChangedDivisionTitles = false;
}
