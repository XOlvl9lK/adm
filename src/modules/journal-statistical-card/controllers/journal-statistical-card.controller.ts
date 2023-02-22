import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/find-journal-statistical-card.dto';
import { Response } from 'express';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardService } from '@modules/journal-statistical-card/services/export-journal-statistical-card.service';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/export-journal-statistical-card.dto';
import { ExportStatusHistoryDto } from '@modules/journal-statistical-card/controllers/dtos/export-status-history.dto';
import { ExportStatusHistoryService } from '@modules/journal-statistical-card/services/export-status-history.service';
import { ExportErrorInfoService } from '@modules/journal-statistical-card/services/export-error-info.service';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { ExportErrorInfoDto } from './dtos/export-error-info.dto';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-statistical-card')
export class JournalStatisticalCardController {
  constructor(
    private findJournalStatisticalCardService: FindJournalStatisticalCardService,
    private exportJournalStatisticalCardService: ExportJournalStatisticalCardService,
    private exportStatusHistoryService: ExportStatusHistoryService,
    private exportErrorInfoService: ExportErrorInfoService,
  ) {}

  @Post()
  @ApplyAuth([dibPermission.statisticalCards.read])
  @UseActionLogger(localUserAction.statisticalCards.getData)
  async getAll(@Body() dto: FindJournalStatisticalCardDto, @RequestUser() user?: User) {
    return await this.findJournalStatisticalCardService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.statisticalCards.read])
  @UseActionLogger(localUserAction.statisticalCards.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportJournalStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalStatisticalCardService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.statisticalCards.read])
  @UseActionLogger(localUserAction.statisticalCards.exportXls)
  async exportXls(
    @Body() dto: ExportJournalStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalStatisticalCardService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.statisticalCards.read])
  @UseActionLogger(localUserAction.statisticalCards.exportOds)
  async exportOds(
    @Body() dto: ExportJournalStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalStatisticalCardService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('export-status-history')
  @ApplyAuth([dibPermission.statisticalCards.read])
  async exportStatusHistory(
    @Query() dto: ExportStatusHistoryDto,
    @Res() response: Response,
    @RequestUser() user?: User,
  ) {
    return await this.exportStatusHistoryService.exportStatusHistory({ ...dto, user }, response);
  }

  @Get('export-error-info')
  @ApplyAuth([dibPermission.statisticalCards.read])
  async exportErrorInfo(@Query() dto: ExportErrorInfoDto, @Res() response: Response, @RequestUser() user?: User) {
    return await this.exportErrorInfoService.exportErrorInfo({ ...dto, user }, response);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.statisticalCards.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findJournalStatisticalCardService.findUniqueValues(
      filterUserDivisions<GetFieldUniqueValues>(dto, user),
    );
  }
}
