import { ListRequestDto } from '@common/utils/types';
import { FileHistoryStatusEnum } from '@modules/file-history/domain/file-history-status.enum';
import { FindAllFileHistory } from '@modules/file-history/services/find-all-file-history.service';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindFileHistoryDto extends ListRequestDto implements FindAllFileHistory {
  @Transform(({ value }) => {
    if (!value || !value?.length || value?.every((d) => `${d}` === 'null' || `${d}` === 'undefined'))
      return undefined;
    return value.map((d) => (d === 'null' || d === 'undefined' ? JSON.parse(d) : d));
  })
  @IsOptional()
  startDate?: [string, string];

  @IsOptional()
  @IsString({ each: true })
  departmentName?: string[];

  @IsOptional()
  @IsEnum(FileHistoryStatusEnum, { each: true })
  status?: FileHistoryStatusEnum[];
}
