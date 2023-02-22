import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateExternalIntegrationService } from '../services/create-external-integration.service';
import { FindAllIntegrationsService } from '../services/find-all-integrations.service';
import { FindIntegrationService } from '../services/find-integration.service';
import { UpdateIntegrationService } from '../services/update-integration.service';
import { CreateExternalIntegrationDto } from './dtos/create-external-integration.dto';
import { FindAllIntegrationsDto } from './dtos/find-all-integrations.dto';
import { UpdateIntegrationDto } from './dtos/update-integration.dto';
import { DeleteIntegrationService } from '../services/delete-integration.service';
import { User } from '@common/auth/infrastructure/user.interface';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { FindUniqueDepartmentsService } from '../services/find-unique-departments.service';
import { FindUniqueDepartmentsDto } from './dtos/find-unique-departments.dto';

@Controller('external-integration')
export class ExternalIntegrationController {
  constructor(
    private findIntegrationService: FindIntegrationService,
    private findAllIntegrationService: FindAllIntegrationsService,
    private createIntegrationService: CreateExternalIntegrationService,
    private updateIntegrationService: UpdateIntegrationService,
    private deleteIntegrationService: DeleteIntegrationService,
    private findUniqueDepartmentsService: FindUniqueDepartmentsService,
  ) {}

  @Get()
  @ApplyAuth([dibPermission.externalInteractions.records.read])
  @UseActionLogger(localUserAction.externalInteraction.records.getData)
  async findAll(@Query() dto: FindAllIntegrationsDto) {
    return await this.findAllIntegrationService.handle({
      ...dto,
      type: [IntegrationTypeEnum.SPV, IntegrationTypeEnum.SMEV, IntegrationTypeEnum.FILE],
    });
  }

  @Get('unique-department')
  @ApplyAuth([dibPermission.externalInteractions.records.read])
  async findUniqueDepartment(@Query() dto: FindUniqueDepartmentsDto) {
    return await this.findUniqueDepartmentsService.handle(dto);
  }

  @Post()
  @ApplyAuth([dibPermission.externalInteractions.records.create])
  @UseActionLogger(localUserAction.externalInteraction.records.create)
  async create(@Body() dto: CreateExternalIntegrationDto, @RequestUser() user?: User) {
    return await this.createIntegrationService.handle({
      ...dto,
      userTimezone: user?.timeZone?.toString(),
    });
  }

  @Put()
  @ApplyAuth([dibPermission.externalInteractions.records.update])
  @UseActionLogger(localUserAction.externalInteraction.records.update)
  async update(@Body() dto: UpdateIntegrationDto, @RequestUser() user?: User) {
    return await this.updateIntegrationService.handle({
      ...dto,
      userTimezone: user?.timeZone?.toString(),
    });
  }

  @Delete(':id')
  @ApplyAuth([dibPermission.externalInteractions.records.delete])
  @UseActionLogger(localUserAction.externalInteraction.records.delete)
  async delete(@Param('id', new ParseIntPipe()) id: number, @RequestUser() user?: User) {
    return await this.deleteIntegrationService.handle({
      id,
      userTimezone: user?.timeZone?.toString(),
    });
  }

  @Get(':id')
  @ApplyAuth([dibPermission.externalInteractions.records.read])
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.findIntegrationService.handle(id);
  }
}
