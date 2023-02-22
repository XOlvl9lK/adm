import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { FindTypicalViolationDto } from './dtos/find-typical-violation.dto';
import { FindTypicalViolationService } from '../services/find-typical-violation.service';
import { ExportTypicalViolationService } from '../services/export-typical-violation.service';
import { ExportTypicalViolationDto } from './dtos/export-typical-violation.dto';
import { Response } from 'express';
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

@Controller('journal-typical-violation')
export class TypicalViolationsController {
  constructor(
    private findTypicalViolationService: FindTypicalViolationService,
    private exportTypicalViolationService: ExportTypicalViolationService,
  ) {}

  // prettier-ignore
  @Post('')
  @ApplyAuth([dibPermission.typicalViolations.read])
  @UseActionLogger(localUserAction.typicalViolations.getData)
  async findAll(@Body() dto: FindTypicalViolationDto, @RequestUser() user?: User) {
    return await this.findTypicalViolationService.findAll(
      filterUserDivisions(dto, user),
    );
  }

  // prettier-ignore
  @Post('export-xlsx')
  @ApplyAuth([dibPermission.typicalViolations.read])
  @UseActionLogger(localUserAction.typicalViolations.exportXlsx)
  async exportXlsx(
    @Res() response: Response,
    @Body() dto: ExportTypicalViolationDto,
    @RequestUser() user?: User,
    @Token() token?: string,
    ) {
    return await this.exportTypicalViolationService.exportXlsx(filterUserDivisions(dto, user), response, token);
  }

  // prettier-ignore
  @Post('export-xls')
  @ApplyAuth([dibPermission.typicalViolations.read])
  @UseActionLogger(localUserAction.typicalViolations.exportXls)
  async exportXls(
    @Res() response: Response,
    @Body() dto: ExportTypicalViolationDto,
    @RequestUser() user?: User,
    @Token() token?: string,
    ) {
    return await this.exportTypicalViolationService.exportXls(filterUserDivisions(dto, user), response, token);
  }

  // prettier-ignore
  @Post('export-ods')
  @ApplyAuth([dibPermission.typicalViolations.read])
  @UseActionLogger(localUserAction.typicalViolations.exportOds)
  async exportOds(
    @Res() response: Response,
    @Body() dto: ExportTypicalViolationDto,
    @RequestUser() user?: User,
    @Token() token?: string,
    ) {
    return await this.exportTypicalViolationService.exportOds(filterUserDivisions(dto, user), response, token);
  }

  @Get('get-unique-values')
  @ApplyAuth([dibPermission.typicalViolations.read])
  async getUniqueValues(@Query() dto: GetUniqueValuesDto, @RequestUser() user?: User) {
    return await this.findTypicalViolationService.findUniqueValues(
      filterUserDivisions<GetFieldUniqueValues>(dto, user),
    );
  }
}
