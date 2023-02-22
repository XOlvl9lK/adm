import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindSpvHistoryDto } from './dtos/find-spv-history.dto';
import { FindSpvHistoryService } from '../services/find-spv-history.service';
import { CreateSpvHistoryService } from '../services/create-spv-history.service';
import { GetLastSpvRequestNumber } from '../services/get-last-spv-request-number.service';
import { CreateSpvHistoryDto } from './dtos/create-spv.history.dto';
import { Response } from 'express';
import { ExportSpvHistoryService } from '../services/export-spv-history.service';
import { ExportSpvHistoryDto } from './dtos/export-spv-history.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { Token } from '@common/auth/decorators/token.decorator';

@ApiTags('Журнал внешних взаимодействий по виду СПВ')
@Controller('spv-history')
export class SpvHistoryController {
  constructor(
    private findSpvHistoryService: FindSpvHistoryService,
    private createSpvHistoryService: CreateSpvHistoryService,
    private getLastSpvRequestNumber: GetLastSpvRequestNumber,
    private exportSpvHistoryService: ExportSpvHistoryService,
  ) {}

  @Post()
  async create(@Body() dto: CreateSpvHistoryDto) {
    return await this.createSpvHistoryService.handle(dto);
  }

  @Get('last-request-number')
  async getLastRequestNumber() {
    return await this.getLastSpvRequestNumber.handle();
  }

  @Get('')
  @ApplyAuth([dibPermission.externalInteractions.records.spv])
  @UseActionLogger(localUserAction.history.spv.getData)
  async findAll(@Query() dto: FindSpvHistoryDto) {
    return await this.findSpvHistoryService.findAll(dto);
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.externalInteractions.records.spv])
  @UseActionLogger(localUserAction.history.spv.exportXlsx)
  async exportXlsx(@Body() dto: ExportSpvHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSpvHistoryService.exportXlsx(dto, response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.externalInteractions.records.spv])
  @UseActionLogger(localUserAction.history.spv.exportXls)
  async exportXls(@Body() dto: ExportSpvHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSpvHistoryService.exportXls(dto, response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.externalInteractions.records.spv])
  @UseActionLogger(localUserAction.history.spv.exportOds)
  async exportOds(@Body() dto: ExportSpvHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSpvHistoryService.exportOds(dto, response, token);
  }
}
