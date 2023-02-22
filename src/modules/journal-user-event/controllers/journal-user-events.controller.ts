import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { FindJournalUserEventsService } from '../services/find-journal-user-events.service';
import { FindUserEventDto } from './dtos/find-user-event.dto';
import { Response } from 'express';
import { ExportJournalUserEventsService } from '../services/export-journal-user-events.service';
import { ExportUserEventDto } from '@modules/journal-user-event/controllers/dtos/export-user-event.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { LogUserEventDto } from './dtos/log-user-event.dto';
import { Request } from 'express';
import { LogUserEventService } from '../services/log-user-event.service';
import { UseActionLogger } from '../infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { getBrowserVersionByUserAgent } from '@common/utils/get-browser-version-by-user-agent';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-user-event')
export class JournalUserEventsController {
  constructor(
    private findUserEventService: FindJournalUserEventsService,
    private exportUserEventService: ExportJournalUserEventsService,
    private logUserEventService: LogUserEventService,
  ) {}

  @Post('log-user-event')
  @ApplyAuth()
  async logUserEvent(@Body() dto: LogUserEventDto, @Req() request: Request, @RequestUser() user: User) {
    return await this.logUserEventService.handle({
      ...dto,
      url: request.header('user-location'),
      browserVersion: getBrowserVersionByUserAgent(request.header('user-agent')),
      user,
    });
  }

  @Post()
  @ApplyAuth([dibPermission.userActions.read])
  @UseActionLogger(localUserAction.userActions.getData)
  async getAll(@Body() dto: FindUserEventDto, @RequestUser() user?: User) {
    return await this.findUserEventService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.userActions.read])
  @UseActionLogger(localUserAction.userActions.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportUserEventDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportUserEventService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.userActions.read])
  @UseActionLogger(localUserAction.userActions.exportXls)
  async exportXls(
    @Body() dto: ExportUserEventDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportUserEventService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.userActions.read])
  @UseActionLogger(localUserAction.userActions.exportOds)
  async exportOds(
    @Body() dto: ExportUserEventDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportUserEventService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.userActions.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findUserEventService.findUniqueValues(filterUserDivisions<GetFieldUniqueValues>(dto, user));
  }
}
