import { SpvSmevFilter } from '@modules/integration/domain/integration/spv-smev-filter.interface';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class SpvSmevFilterDto implements SpvSmevFilter {
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
  loadKuspPackages: boolean;

  @IsBoolean()
  loadStatisticalCards: boolean;
}
