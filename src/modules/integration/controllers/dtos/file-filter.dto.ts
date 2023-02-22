import { FileFilter } from '@modules/integration/domain/integration/file-filter.interface';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class FileFilterDto implements FileFilter {
  @IsBoolean()
  unloadDpuAndKuspArrays: boolean;

  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  onlyDepartments: number[];

  @IsString({ each: true })
  onlyArraysOfDpuAndKusp: string[];

  @IsBoolean()
  unloadStatisticalReports: boolean;

  @IsString({ each: true })
  onlyStatisticalReports: string[];

  @IsBoolean()
  unloadChangesFromLastUnload: boolean;
}
