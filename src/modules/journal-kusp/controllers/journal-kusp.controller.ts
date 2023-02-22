import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/find-journal-kusp.dto';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { Response } from 'express';
import { ExportJournalKuspService } from '@modules/journal-kusp/services/export-journal-kusp.service';
import { ExportErrorInfoService } from '@modules/journal-kusp/services/export-error-info.service';
import { ExportJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/export-journal-kusp.dto';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { ExportErrorInfoDto } from './dtos/export-error-info.dto';
import { GetKuspFileDto } from './dtos/get-kusp-file.dto';
import { GetKuspFileService } from '../services/get-kusp-file.service';
import { Token } from '@common/auth/decorators/token.decorator';
@Controller('journal-kusp')
export class JournalKuspController {
  constructor(
    private findJournalKuspService: FindJournalKuspService,
    private exportJournalKuspService: ExportJournalKuspService,
    private exportErrorInfoService: ExportErrorInfoService,
    private getKuspFileService: GetKuspFileService,
  ) {}

  @Post()
  @ApplyAuth([dibPermission.kuspProcessing.read])
  @UseActionLogger(localUserAction.kusp.getData)
  async getAll(@Body() dto: FindJournalKuspDto, @RequestUser() user?: User) {
    return await this.findJournalKuspService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  @UseActionLogger(localUserAction.kusp.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportJournalKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalKuspService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  @UseActionLogger(localUserAction.kusp.exportXls)
  async exportXls(
    @Body() dto: ExportJournalKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalKuspService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  @UseActionLogger(localUserAction.kusp.exportOds)
  async exportOds(
    @Body() dto: ExportJournalKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportJournalKuspService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('export-error-info')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  async exportErrorInfo(@Query() dto: ExportErrorInfoDto, @Res() response: Response, @RequestUser() user?: User) {
    return await this.exportErrorInfoService.exportErrorInfo({ ...dto, user }, response);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findJournalKuspService.findUniqueValues(filterUserDivisions<GetFieldUniqueValues>(dto, user));
  }

  @Post('get-file')
  @ApplyAuth([dibPermission.kuspProcessing.read])
  @UseActionLogger(localUserAction.kusp.getKuspFile)
  async getKuspFile(@Body() dto: GetKuspFileDto, @Res() response: Response) {
    const { archive, name } = await this.getKuspFileService.handle(dto);
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(name)}`);
    await archive.pipe(response);
  }
}
