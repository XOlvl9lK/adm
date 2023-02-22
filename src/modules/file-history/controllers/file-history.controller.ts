import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportFileHistoryService } from '../services/export-file-history.service';
import { FindAllFileHistoryService } from '../services/find-all-file-history.service';
import { GetLastRequestDateService } from '../services/get-last-request-date.service';
import { ExportFileHistoryDto } from './dtos/export-file-history.dto';
import { FindFileHistoryDto } from './dtos/find-file-history.dto';
import { GetLastRequestDateDto } from './dtos/get-last-request-date.dto';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('file-history')
export class FileHistoryController {
  constructor(
    private getLastRequestDateService: GetLastRequestDateService,
    private findAllFileHistoryService: FindAllFileHistoryService,
    private exportFileHistoryService: ExportFileHistoryService,
  ) {}

  @Get()
  @ApplyAuth([dibPermission.externalInteractions.records.file])
  @UseActionLogger(localUserAction.history.file.getData)
  async findAll(@Query() dto: FindFileHistoryDto) {
    return await this.findAllFileHistoryService.handle(dto);
  }

  @Get('last-request-date')
  async getLastRequestDate(@Query() dto: GetLastRequestDateDto) {
    return await this.getLastRequestDateService.handle(dto);
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.externalInteractions.records.file])
  @UseActionLogger(localUserAction.history.file.exportXlsx)
  async exportXlsx(@Body() dto: ExportFileHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportFileHistoryService.exportXlsx(dto, response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.externalInteractions.records.file])
  @UseActionLogger(localUserAction.history.file.exportXls)
  async exportXls(@Body() dto: ExportFileHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportFileHistoryService.exportXls(dto, response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.externalInteractions.records.file])
  @UseActionLogger(localUserAction.history.file.exportOds)
  async exportOds(@Body() dto: ExportFileHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportFileHistoryService.exportOds(dto, response, token);
  }
}
