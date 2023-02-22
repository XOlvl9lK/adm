import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GetIntegrationCommonSettingService } from '../services/get-integration-common-setting.service';
import { UpdateIntegrationCommonSettingService } from '../services/update-integration-common-setting.service';
import { UpdateIntegrationCommonSettingDto } from './dtos/update-integration-common-setting.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';

@Controller('integration-common-setting')
export class IntegrationCommonSettingController {
  constructor(
    private getCommonSettingService: GetIntegrationCommonSettingService,
    private updateCommonSettingService: UpdateIntegrationCommonSettingService,
  ) {}

  @Get('')
  @ApplyAuth([dibPermission.externalInteractions.settings.read])
  @UseActionLogger(localUserAction.externalInteraction.settings.getData)
  async getCommonSetting() {
    return await this.getCommonSettingService.handle();
  }

  @Post('')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'GAS_PS_SIGN' }, { name: 'SMEV_SIGN' }]))
  @ApplyAuth([dibPermission.externalInteractions.settings.update])
  @UseActionLogger(localUserAction.externalInteraction.settings.update)
  async updateCommonSetting(
    @Body() dto: UpdateIntegrationCommonSettingDto,
    @UploadedFiles()
    files: {
      GAS_PS_SIGN: Express.Multer.File[];
      SMEV_SIGN: Express.Multer.File[];
    },
  ) {
    return await this.updateCommonSettingService.handle({
      ...dto,
      smevSign: files.SMEV_SIGN?.[0],
      gaspsSign: files.GAS_PS_SIGN?.[0],
    });
  }
}
