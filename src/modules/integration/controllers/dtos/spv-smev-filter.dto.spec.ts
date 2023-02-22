import 'reflect-metadata';
import { SpvSmevFilter } from '@modules/integration/domain/integration/spv-smev-filter.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SpvSmevFilterDto } from './spv-smev-filter.dto';

describe('SpvSmevFilterDto', () => {
  it('should pass validation', async () => {
    const payload: SpvSmevFilter = {
      unloadDpuAndKuspArrays: true,
      onlyDepartments: [],
      onlyArraysOfDpuAndKusp: [],
      unloadStatisticalReports: true,
      onlyStatisticalReports: [],
      loadKuspPackages: true,
      loadStatisticalCards: true,
    };
    const dto = plainToInstance(SpvSmevFilterDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties is missing', async () => {
    const dto = plainToInstance(SpvSmevFilterDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(7);
  });
});
