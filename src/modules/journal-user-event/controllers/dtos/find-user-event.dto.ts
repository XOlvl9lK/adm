import { ListRequestDto } from '@common/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UserEventResultTypeEnum } from '../../domain/user-event-result-type.enum';
import { Transform } from 'class-transformer';

export class FindUserEventDto extends ListRequestDto {
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
    description: 'Имя пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  userLogin?: string;

  @ApiProperty({
    description: 'Id ведомства',
    required: false,
  })
  @IsOptional()
  @IsString()
  browserVersion?: string;

  @ApiProperty({
    description: 'IP адрес клиента',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'Результат события',
    required: false,
    enum: UserEventResultTypeEnum,
  })
  @IsOptional()
  @IsEnum(UserEventResultTypeEnum, { each: true })
  result?: UserEventResultTypeEnum[];

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
