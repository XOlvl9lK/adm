import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FindNsiChangeService } from '../services/find-nsi-change.service';
import { FindNsiChangeDto } from './dto/find-nsi-change.dto';
import { ExportNsiChangeService } from '../services/export-nsi-change.service';
import { Response } from 'express';
import { ExportNsiChangeDto } from './dto/export-nsi-change.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { GetUniqueValuesDto } from './dto/get-unique-values.dto';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-nsi-change')
export class NsiChangeController {
  constructor(
    private findNsiChangeService: FindNsiChangeService,
    private exportNsiChangeService: ExportNsiChangeService,
  ) {}

  @Post('')
  @ApplyAuth([dibPermission.nsiChanges.read])
  @UseActionLogger(localUserAction.nsiChanges.getData)
  async getAll(@Body() dto: FindNsiChangeDto) {
    return await this.findNsiChangeService.findAll(dto);
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.nsiChanges.read])
  @UseActionLogger(localUserAction.nsiChanges.exportXlsx)
  async exportXlsx(@Res() response: Response, @Body() dto: ExportNsiChangeDto, @Token() token?: string) {
    return await this.exportNsiChangeService.exportXlsx(dto, response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.nsiChanges.read])
  @UseActionLogger(localUserAction.nsiChanges.exportXls)
  async exportXls(@Res() response: Response, @Body() dto: ExportNsiChangeDto, @Token() token?: string,) {
    return await this.exportNsiChangeService.exportXls(dto, response, token);
  }

  @Post('export-ods')
  @UseActionLogger(localUserAction.nsiChanges.exportOds)
  async exportOds(@Res() response: Response, @Body() dto: ExportNsiChangeDto, @Token() token?: string,) {
    return await this.exportNsiChangeService.exportOds(dto, response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.nsiChanges.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findNsiChangeService.findUniqueValues(dto);
  }
}
