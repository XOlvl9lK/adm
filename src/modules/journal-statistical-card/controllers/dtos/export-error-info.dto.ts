import { IdDto } from '@common/utils/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExportErrorInfo } from '../../services/export-error-info.service';

enum FormatEnum {
  XLSX = 'xlsx',
  XLS = 'xls',
  ODS = 'ods',
}

export class ExportErrorInfoDto extends IdDto implements Omit<ExportErrorInfo, 'user'> {
  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsEnum(FormatEnum)
  format: FormatEnum;
}
