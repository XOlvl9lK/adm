import 'reflect-metadata';
import { UpdateIntegration } from '@modules/integration/services/update-integration.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateIntegrationDto } from './update-integration.dto';

describe('UpdateIntegrationDto', () => {
  it('should pass validation', async () => {
    const payload: UpdateIntegration = {
      id: 1,
    };
    const dto = plainToInstance(UpdateIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties is missing', async () => {
    const dto = plainToInstance(UpdateIntegrationDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(1);
  });
});
