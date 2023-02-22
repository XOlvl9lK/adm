import { HistoryRequestMethodDto } from '@common/responses/history-request-method.dto';
import { RequestStateEnum } from '@modules/spv-history/domain/request-state.enum';
import { SpvHistoryEntity } from '@modules/spv-history/domain/spv-history.entity';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  isDate,
  isDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CreateSpvHistoryDto implements SpvHistoryEntity {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  requestNumber: number;

  @IsEnum(RequestStateEnum)
  requestState: RequestStateEnum;

  @IsObject()
  @ValidateNested()
  @Type(() => HistoryRequestMethodDto)
  requestMethod: HistoryRequestMethodDto;

  @IsString()
  startDate: string;

  @IsOptional()
  @Transform(({ value }) => (isDateString(value) || isDate(value) ? new Date(value) : undefined))
  @IsDate()
  finishDate?: Date;

  @IsString()
  @IsUrl()
  requestXmlUrl: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  responseXmlUrl?: string;

  @IsString()
  integrationName: string;

  @IsString()
  uniqueSecurityKey: string;
}
