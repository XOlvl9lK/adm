import 'reflect-metadata';
import { SchedulerEntity, SchedulerTypeEnum } from '@modules/integration/domain/scheduler/scheduler.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SchedulerEntityDto } from './scheduler-entity.dto';

describe('SchedulerEntityDto', () => {
  it('should pass validation', async () => {
    const payload: SchedulerEntity = {
      type: SchedulerTypeEnum.DAILY,
      time: '05:05',
    };
    const dto = plainToInstance(SchedulerEntityDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties is missing', async () => {
    const dto = plainToInstance(SchedulerEntityDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(2);
  });
});
