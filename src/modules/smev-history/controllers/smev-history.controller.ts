import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { FindSmevHistoryDto } from '@modules/smev-history/controllers/dtos/find-smev-history.dto';
import { ExportSmevHistoryService } from '@modules/smev-history/services/export-smev-history.service';
import { Response } from 'express';
import { ExportSmevHistoryDto } from '@modules/smev-history/controllers/dtos/export-smev-history.dto';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('smev-history')
export class SmevHistoryController {
  constructor(
    private findSmevHistoryService: FindSmevHistoryService,
    private exportSmevHistoryService: ExportSmevHistoryService,
  ) {}

  @Get()
  @ApplyAuth([dibPermission.externalInteractions.records.smev])
  @UseActionLogger(localUserAction.history.smev.getData)
  async getAll(@Query() dto: FindSmevHistoryDto) {
    return await this.findSmevHistoryService.findAll(dto);
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.externalInteractions.records.smev])
  @UseActionLogger(localUserAction.history.smev.exportXlsx)
  async exportXlsx(@Body() dto: ExportSmevHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSmevHistoryService.exportXlsx(dto, response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.externalInteractions.records.smev])
  @UseActionLogger(localUserAction.history.smev.exportXls)
  async exportXls(@Body() dto: ExportSmevHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSmevHistoryService.exportXls(dto, response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.externalInteractions.records.smev])
  @UseActionLogger(localUserAction.history.smev.exportOds)
  async exportOds(@Body() dto: ExportSmevHistoryDto, @Res() response: Response, @Token() token?: string) {
    return await this.exportSmevHistoryService.exportOds(dto, response, token);
  }
}
