import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonSettingNameEnum } from '../domain/common-setting-name.enum';
import { IntegrationCommonSettingEntity } from '../domain/integration-common-setting.entity';
// eslint-disable-next-line max-len
import { UpdateIntegrationCommonSettingDto } from '@modules/integration-common-setting/controllers/dtos/update-integration-common-setting.dto';

export type UpdateIntegrationCommonSetting = UpdateIntegrationCommonSettingDto & {
  gaspsSign?: Express.Multer.File;
  smevSign?: Express.Multer.File;
};

@Injectable()
export class UpdateIntegrationCommonSettingService {
  constructor(
    @InjectRepository(IntegrationCommonSettingEntity)
    private commonSettingRepository: Repository<IntegrationCommonSettingEntity>,
  ) {}

  async handle(data: UpdateIntegrationCommonSetting) {
    const previousSettings = await this.commonSettingRepository.find();
    previousSettings.forEach((prev) => {
      if (prev.key === CommonSettingNameEnum.GAS_PS_SIGN) {
        prev.file = data.gaspsSign?.buffer || prev.file;
        prev.fileName = data.gaspsSign?.originalname || prev.fileName;
      } else if (prev.key === CommonSettingNameEnum.SMEV_SIGN) {
        prev.file = data.smevSign?.buffer || prev.file;
        prev.fileName = data.smevSign?.originalname || prev.fileName;
      } else {
        prev.value = data[prev.key];
      }
    });
    return await this.commonSettingRepository.save(previousSettings);
  }
}
