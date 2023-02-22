import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindCancellationRecordCardService } from '../services/find-cancellation-record-card.service';
import { ExportCancellationRecordCardService } from '../services/export-cancellation-record-card.service';
import { FindCancellationRecordCardDto } from './dto/find-cancellation-record-card.dto';
import { Response } from 'express';
import { ExportCancellationRecordCardDto } from './dto/export-cancellation-record-card.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dto/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-cancellation-record-card')
export class CancellationRecordCardController {
  constructor(
    private findCancellationRecordCardService: FindCancellationRecordCardService,
    private exportCancellationRecordCardService: ExportCancellationRecordCardService,
  ) {}

  @Post('')
  @ApplyAuth([dibPermission.cancellation.indexCards.read])
  @UseActionLogger(localUserAction.cancellation.indexCards.getData)
  async findAll(@Body() dto: FindCancellationRecordCardDto, @RequestUser() user?: User) {
    return await this.findCancellationRecordCardService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.cancellation.indexCards.read])
  @UseActionLogger(localUserAction.cancellation.indexCards.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportCancellationRecordCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationRecordCardService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.cancellation.indexCards.read])
  @UseActionLogger(localUserAction.cancellation.indexCards.exportXls)
  async exportXls(
    @Body() dto: ExportCancellationRecordCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationRecordCardService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.cancellation.indexCards.read])
  @UseActionLogger(localUserAction.cancellation.indexCards.exportOds)
  async exportOds(
    @Body() dto: ExportCancellationRecordCardDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationRecordCardService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.cancellation.indexCards.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findCancellationRecordCardService.findUniqueValues(
      filterUserDivisions<GetFieldUniqueValues>(dto, user),
    );
  }
}
