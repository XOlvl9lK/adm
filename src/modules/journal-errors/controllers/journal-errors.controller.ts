import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { FindJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/find-journal-errors.dto';
import { ExportJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/export-journal-errors.dto';
import { ExportJournalErrorsService } from '@modules/journal-errors/services/export-journal-errors.service';
import { Response } from 'express';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-errors')
export class JournalErrorsController {
  constructor(
    private findJournalErrorsService: FindJournalErrorsService,
    private exportJournalErrorsService: ExportJournalErrorsService,
  ) {}

  @Post()
  @ApplyAuth([dibPermission.errorLogging.read])
  @UseActionLogger(localUserAction.errorLogging.getData)
  async getAll(@Body() dto: FindJournalErrorsDto, @RequestUser() user?: User) {
    return await this.findJournalErrorsService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.errorLogging.read])
  @UseActionLogger(localUserAction.errorLogging.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportJournalErrorsDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalErrorsService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.errorLogging.read])
  @UseActionLogger(localUserAction.errorLogging.exportXls)
  async exportXls(
    @Body() dto: ExportJournalErrorsDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalErrorsService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.errorLogging.read])
  @UseActionLogger(localUserAction.errorLogging.exportOds)
  async exportOds(
    @Body() dto: ExportJournalErrorsDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalErrorsService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xml')
  @ApplyAuth([dibPermission.errorLogging.read])
  @UseActionLogger(localUserAction.errorLogging.exportXml)
  async exportXml(@Body() dto: ExportJournalErrorsDto, @Res() response: Response, @RequestUser() user?: User) {
    return await this.exportJournalErrorsService.exportXml(filterUserDivisions(dto, user), response);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.errorLogging.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findJournalErrorsService.findUniqueValues(filterUserDivisions<GetFieldUniqueValues>(dto, user));
  }
}
