import 'reflect-metadata';
import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateIntegrationCommonSettingDto } from './update-integration-common-setting.dto';

describe('UpdateIntegrationCommonSettingDto', () => {
  it('should pass validation', async () => {
    const dto = plainToInstance(UpdateIntegrationCommonSettingDto, {
      [CommonSettingNameEnum.GAS_PS_MESSAGE_RECEIVE_URL]: '',
      [CommonSettingNameEnum.SMEV_SEND_MESSAGE_URL]: '',
      [CommonSettingNameEnum.GAS_PS_SIGN_PASS]: '',
    });
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('shouldn`t pass validation', async () => {
    const dto = plainToInstance(UpdateIntegrationCommonSettingDto, {});
    const result = await validate(dto);
    expect(result).toHaveLength(3);
  });
});
