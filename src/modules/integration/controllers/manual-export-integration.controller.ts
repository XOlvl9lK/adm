import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateManualExportIntegrationService } from '../services/create-manual-export-integration.service';
import { UpdateIntegrationService } from '../services/update-integration.service';
import { FindIntegrationService } from '../services/find-integration.service';
import { FindAllIntegrationsService } from '../services/find-all-integrations.service';
import { FindAllIntegrationsDto } from './dtos/find-all-integrations.dto';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { CreateManualExportIntegrationDto } from './dtos/create-manual-export-integration.dto';
import { UpdateIntegrationDto } from './dtos/update-integration.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { DeleteIntegrationService } from '../services/delete-integration.service';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';

@Controller('manual-export-integration')
export class ManualExportIntegrationController {
  constructor(
    private createIntegrationService: CreateManualExportIntegrationService,
    private updateIntegrationService: UpdateIntegrationService,
    private deleteIntegrationService: DeleteIntegrationService,
    private findIntegrationService: FindIntegrationService,
    private findAllIntegrationService: FindAllIntegrationsService,
  ) {}

  @Get()
  @ApplyAuth([dibPermission.manualExport.settings.read, dibPermission.manualExport.records.read], 'OR')
  @UseActionLogger(localUserAction.manualExport.getData)
  async findAll(@Query() dto: FindAllIntegrationsDto) {
    return await this.findAllIntegrationService.handle({
      ...dto,
      type: IntegrationTypeEnum.MANUAL_EXPORT,
    });
  }

  @Get(':id')
  @ApplyAuth([dibPermission.manualExport.settings.read, dibPermission.manualExport.records.read], 'OR')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.findIntegrationService.handle(id);
  }

  @Post()
  @ApplyAuth([dibPermission.manualExport.settings.create])
  @UseActionLogger(localUserAction.manualExport.settings.create)
  async create(@Body() dto: CreateManualExportIntegrationDto, @RequestUser() user?: User) {
    return await this.createIntegrationService.handle({
      ...dto,
      userTimezone: user?.timeZone?.toString(),
    });
  }

  @Put()
  @ApplyAuth([dibPermission.manualExport.settings.update])
  @UseActionLogger(localUserAction.manualExport.settings.update)
  async update(@Body() dto: UpdateIntegrationDto, @RequestUser() user?: User) {
    return await this.updateIntegrationService.handle({
      ...dto,
      userTimezone: user?.timeZone?.toString(),
    });
  }

  @Delete(':id')
  @ApplyAuth([dibPermission.manualExport.settings.delete])
  @UseActionLogger(localUserAction.manualExport.settings.delete)
  async delete(@Param('id', new ParseIntPipe()) id: number, @RequestUser() user?: User) {
    return await this.deleteIntegrationService.handle({
      id,
      userTimezone: user?.timeZone?.toString(),
    });
  }
}
