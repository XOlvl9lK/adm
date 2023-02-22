import { ListRequestDto } from '@common/utils/types';
import { NsiChangeActionEnum } from '@modules/journal-nsi-change/domain/nsi-change-action.enum';
import { NsiChangeObjectEnum } from '@modules/journal-nsi-change/domain/nsi-change-object.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindNsiChangeDto extends ListRequestDto {
  @ApiProperty({
    description: 'Массив дат от и до',
    example: [new Date().toISOString(), new Date().toISOString()],
    required: false,
  })
  @IsOptional()
  eventDate?: [string, string];

  @ApiProperty({
    description: 'ФИО пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'IP-адрес',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'Объект',
    required: false,
  })
  @IsOptional()
  @IsEnum(NsiChangeObjectEnum, { each: true })
  objectTitle?: NsiChangeObjectEnum[];

  @ApiProperty({
    description: 'Действие',
    required: false,
  })
  @IsOptional()
  @IsEnum(NsiChangeActionEnum, { each: true })
  eventTitle?: NsiChangeActionEnum[];
}
