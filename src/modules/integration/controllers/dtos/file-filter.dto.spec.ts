import 'reflect-metadata';
import { FileFilter } from '@modules/integration/domain/integration/file-filter.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FileFilterDto } from './file-filter.dto';

describe('FileFilterDto', () => {
  it('should pass validation', async () => {
    const payload: FileFilter = {
      unloadDpuAndKuspArrays: false,
      onlyDepartments: [],
      onlyArraysOfDpuAndKusp: [],
      unloadStatisticalReports: false,
      onlyStatisticalReports: [],
      unloadChangesFromLastUnload: false,
    };
    const dto = plainToInstance(FileFilterDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties is missing', async () => {
    const payload: FileFilter = {} as FileFilter;
    const dto = plainToInstance(FileFilterDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(6);
  });
});
