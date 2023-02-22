import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { IsEnum, IsString } from 'class-validator';

export class IntegrationCommonSettingDto {
  @IsEnum(CommonSettingNameEnum)
  key: CommonSettingNameEnum;

  @IsString()
  value: string;
}
