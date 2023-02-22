import { IdDto } from '@common/utils/types';
import { ExportErrorInfo } from '@modules/journal-kusp/services/export-error-info.service';
import { IsEnum, IsString } from 'class-validator';

enum FormatEnum {
  XLSX = 'xlsx',
  XLS = 'xls',
  ODS = 'ods',
}

export class ExportErrorInfoDto extends IdDto implements Omit<ExportErrorInfo, 'user'> {
  @IsString()
  timeZone: string;

  @IsEnum(FormatEnum)
  format: FormatEnum;
}
