import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/find-journal-cancellation-statistical-card.dto';
import { Response } from 'express';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/export-journal-cancellation-statistical-card.dto';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/export-journal-cancellation-statistical-card.service';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-cancellation-statistical-card')
export class JournalCancellationStatisticalCardController {
  constructor(
    private findJournalCancellationStatisticalCardService: FindJournalCancellationStatisticalCardService,
    private exportJournalCancellationStatisticalCardService: ExportJournalCancellationStatisticalCardService,
  ) {}

  @Post()
  @ApplyAuth([dibPermission.cancellation.statisticalCards.read])
  @UseActionLogger(localUserAction.cancellation.statisticalCards.getData)
  async getAll(@Body() dto: FindJournalCancellationStatisticalCardDto, @RequestUser() user?: User) {
    return await this.findJournalCancellationStatisticalCardService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.cancellation.statisticalCards.read])
  @UseActionLogger(localUserAction.cancellation.statisticalCards.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportJournalCancellationStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalCancellationStatisticalCardService.exportXlsx(
      filterUserDivisions(dto, user),
      response,
      token,
    );
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.cancellation.statisticalCards.read])
  @UseActionLogger(localUserAction.cancellation.statisticalCards.exportXls)
  async exportXls(
    @Body() dto: ExportJournalCancellationStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalCancellationStatisticalCardService.exportXls(
      filterUserDivisions(dto, user),
      response,
      token,
    );
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.cancellation.statisticalCards.read])
  @UseActionLogger(localUserAction.cancellation.statisticalCards.exportOds)
  async exportOds(
    @Body() dto: ExportJournalCancellationStatisticalCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalCancellationStatisticalCardService.exportOds(
      filterUserDivisions(dto, user),
      response,
      token,
    );
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.cancellation.statisticalCards.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findJournalCancellationStatisticalCardService.findUniqueValues(
      filterUserDivisions<GetFieldUniqueValues>(dto, user),
    );
  }
}
