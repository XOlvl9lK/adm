import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/find-journal-loading-unloading.dto';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/export-journal-loading-unloading.dto';
import { Response } from 'express';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/export-journal-loading-unloading.service';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-loading-unloading')
export class JournalLoadingUnloadingController {
  constructor(
    private findJournalLoadingUnloadingService: FindJournalLoadingUnloadingService,
    private exportJournalLoadingUnloadingService: ExportJournalLoadingUnloadingService,
  ) {}

  @Post()
  @ApplyAuth([dibPermission.statisticalCardsUpload.read])
  @UseActionLogger(localUserAction.uploadAndDownloads.getData)
  async getAll(@Body() journalLoadingUnloadingDto: FindJournalLoadingUnloadingDto) {
    return await this.findJournalLoadingUnloadingService.findAll(journalLoadingUnloadingDto);
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.statisticalCardsUpload.read])
  @UseActionLogger(localUserAction.uploadAndDownloads.exportXlsx)
  async exportXlsx(
    @Body() journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto,
    @Res() response: Response,
    @Token() token?: string,
  ) {
    return await this.exportJournalLoadingUnloadingService.exportXlsx(journalLoadingUnloadingDto, response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.statisticalCardsUpload.read])
  @UseActionLogger(localUserAction.uploadAndDownloads.exportXls)
  async exportXls(
    @Body() journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto,
    @Res() response: Response,
    @Token() token?: string,
  ) {
    return await this.exportJournalLoadingUnloadingService.exportXls(journalLoadingUnloadingDto, response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.statisticalCardsUpload.read])
  @UseActionLogger(localUserAction.uploadAndDownloads.exportOds)
  async exportOds(
    @Body() journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto,
    @Res() response: Response,
    @Token() token?: string,
  ) {
    return await this.exportJournalLoadingUnloadingService.exportOds(journalLoadingUnloadingDto, response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.statisticalCardsUpload.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto) {
    return await this.findJournalLoadingUnloadingService.findUniqueValues(dto);
  }
}
