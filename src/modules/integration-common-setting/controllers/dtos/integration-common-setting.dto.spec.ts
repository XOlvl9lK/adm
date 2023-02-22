import 'reflect-metadata';
import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IntegrationCommonSettingDto } from './integration-common-setting.dto';

describe('IntegrationCommonSettingDto', () => {
  it('should pass validation', async () => {
    const dto = plainToInstance(IntegrationCommonSettingDto, {
      key: CommonSettingNameEnum.GAS_PS_SIGN,
      value: '',
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation if some properties not exists', async () => {
    const dto = plainToInstance(IntegrationCommonSettingDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(2);
  });
});
