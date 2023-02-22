import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { IsString } from 'class-validator';

export class UpdateIntegrationCommonSettingDto {
  @IsString()
  [CommonSettingNameEnum.GAS_PS_MESSAGE_RECEIVE_URL]: string;

  @IsString()
  [CommonSettingNameEnum.SMEV_SEND_MESSAGE_URL]: string;

  @IsString()
  [CommonSettingNameEnum.GAS_PS_SIGN_PASS]: string;
}
