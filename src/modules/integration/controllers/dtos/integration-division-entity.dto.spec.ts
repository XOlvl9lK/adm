import 'reflect-metadata';
import { SchedulerTypeEnum } from '@modules/integration/domain/scheduler/scheduler.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IntegrationDivisionEntityDto } from './integration-division-entity.dto';
import { SchedulerEntityDto } from './scheduler-entity.dto';

describe('IntegrationDivisionEntityDto', () => {
  it('should pass validation', async () => {
    const dto = plainToInstance(IntegrationDivisionEntityDto, {
      divisionId: 1,
      divisionName: '1',
      path: '1',
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties are missing', async () => {
    const dto = plainToInstance(IntegrationDivisionEntityDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(3);
  });

  it('should validate nested objects', async () => {
    const scheduler = plainToInstance(SchedulerEntityDto, {
      type: SchedulerTypeEnum.DAILY,
      time: '04:04',
    });
    const dto = plainToInstance(IntegrationDivisionEntityDto, {
      divisionId: 1,
      divisionName: '1',
      path: '1',
      schedulerDpuKusp: scheduler,
      schedulerStatisticalReport: scheduler,
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });
});
