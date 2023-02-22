import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ExportCancellationKuspDto } from './dtos/export-cancellation-kusp.dto';
import { FindCancellationKuspDto } from './dtos/find-cancellation-kusp.dto';
import { Response } from 'express';
import { FindCancellationKuspService } from '../services/find-cancellation-kusp.service';
import { ExportCancellationKuspService } from '../services/export-cancellation-kusp.service';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { dibPermission } from '@common/auth/infrastructure/dib-permission.constant';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';
import { filterUserDivisions } from '@common/auth/utils/filter-user-divisions.util';
import { localUserAction } from '@modules/journal-user-event/infrastructure/constants/local-user-action.constant';
import { UseActionLogger } from '@modules/journal-user-event/infrastructure/decorators/use-action-logger.decorator';
import { GetUniqueValuesDto } from './dtos/get-unique-values.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Token } from '@common/auth/decorators/token.decorator';

@Controller('journal-cancellation-kusp')
export class CancellationKuspController {
  constructor(
    private findCancellationKuspService: FindCancellationKuspService,
    private exportCancellationKuspService: ExportCancellationKuspService,
  ) {}

  @Post('')
  @ApplyAuth([dibPermission.cancellation.kusp.read])
  @UseActionLogger(localUserAction.cancellation.kusp.getData)
  async findAll(@Body() dto: FindCancellationKuspDto, @RequestUser() user?: User) {
    return await this.findCancellationKuspService.findAll(filterUserDivisions(dto, user));
  }

  @Post('export-xlsx')
  @ApplyAuth([dibPermission.cancellation.kusp.read])
  @UseActionLogger(localUserAction.cancellation.kusp.exportXlsx)
  async exportXlsx(
    @Body() dto: ExportCancellationKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationKuspService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-xls')
  @ApplyAuth([dibPermission.cancellation.kusp.read])
  @UseActionLogger(localUserAction.cancellation.kusp.exportXls)
  async exportXls(
    @Body() dto: ExportCancellationKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationKuspService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  @Post('export-ods')
  @ApplyAuth([dibPermission.cancellation.kusp.read])
  @UseActionLogger(localUserAction.cancellation.kusp.exportOds)
  async exportOds(
    @Body() dto: ExportCancellationKuspDto,
    @Res() response: Response,
    @RequestUser() user?: User,
    @Token() token?: string,
  ) {
    return await this.exportCancellationKuspService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.cancellation.kusp.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findCancellationKuspService.findUniqueValues(
      filterUserDivisions<GetFieldUniqueValues>(dto, user),
    );
  }
}
