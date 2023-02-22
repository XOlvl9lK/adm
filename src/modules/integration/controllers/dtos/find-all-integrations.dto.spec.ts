import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindAllIntegrationsDto } from './find-all-integrations.dto';

describe('FindAllIntegrationsDto', () => {
  it('should pass validation if it has no properties', async () => {
    const dto = plainToInstance(FindAllIntegrationsDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('should pass validation if all properties passed', async () => {
    const dto = plainToInstance(FindAllIntegrationsDto, {
      page: 1,
      pageSize: 1,
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('should pass validation if properties in string type', async () => {
    const dto = plainToInstance(FindAllIntegrationsDto, {
      page: '1',
      pageSize: '1',
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });
});
