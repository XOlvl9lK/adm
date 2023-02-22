import { Controller, Get, Query, Res } from '@nestjs/common';
import { GetNsiRegionService } from '../services/get-nsi-region.service';
import { GetNsiDepartmentService } from '../services/get-nsi-department.service';
import { FindAllNsiSubdivisionDto } from './dtos/find-all-nsi-subdivision.dto';
import { GetNsiSubdivisionService } from '../services/get-nsi-subdivision.service';
import { GetNsiResponseMeasureService } from '../services/get-nsi-response-measure.service';
import { GetNsiProsecutorOfficeService } from '../services/get-nsi-prosecutor-office.service';
import { ClientCacheUpdateService } from '@modules/nsi-dictionary/services/client-cache-update.service';
import { Response } from 'express';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';
import { ApplyAuth } from '@common/auth/decorators/apply-auth.decorator';
import { RequestUser } from '@common/auth/decorators/request-user.decorator';
import { User } from '@common/auth/infrastructure/user.interface';

@Controller('nsi-dictionary')
export class NsiDictionaryController {
  constructor(
    private getNsiRegionService: GetNsiRegionService,
    private getNsiDepartmentService: GetNsiDepartmentService,
    private getNsiSubdivisionService: GetNsiSubdivisionService,
    private getNsiResponseMeasureService: GetNsiResponseMeasureService,
    private getNsiProsecutorOfficeService: GetNsiProsecutorOfficeService,
    private clientCacheUpdateService: ClientCacheUpdateService,
  ) {}

  @Get('region/findAll')
  async getNsiRegions(@Query() dto: FindAuthorityDto) {
    return await this.getNsiRegionService.getAll(dto);
  }

  @Get('region/user/findAll')
  @ApplyAuth()
  async getNsiRegionsByUser(@Query() dto: FindAuthorityDto, @RequestUser() user: User) {
    return await this.getNsiRegionService.getAllByUser(dto, user);
  }

  @Get('department/findAll')
  async getNsiDepartments(@Query() dto: FindAuthorityDto) {
    return await this.getNsiDepartmentService.getAll(dto);
  }

  @Get('department/user/findAll')
  @ApplyAuth()
  async getNsiDepartmentsByUser(@Query() dto: FindAuthorityDto, @RequestUser() user: User) {
    return await this.getNsiDepartmentService.getAllByUser(dto, user);
  }

  @Get('subdivision/findAll')
  async getNsiSubdivisions(@Query() dto: FindAllNsiSubdivisionDto) {
    return await this.getNsiSubdivisionService.getAll(dto);
  }

  @Get('subdivision/user/findAll')
  @ApplyAuth()
  async getNsiSubdivisionsByUser(@Query() dto: FindAllNsiSubdivisionDto, @RequestUser() user: User) {
    return await this.getNsiSubdivisionService.getAllByUser(dto, user);
  }

  @Get('response-measure/findAll')
  async findAllResponseMeasures(@Query() dto: FindAuthorityDto) {
    return await this.getNsiResponseMeasureService.findAll(dto);
  }

  @Get('prosecutor-office/findAll')
  async findAllProsecutorOffices(@Query() dto: FindAuthorityDto) {
    return await this.getNsiProsecutorOfficeService.findAll(dto);
  }

  @Get('subscribe-to-cache-update')
  async subscribeToCacheUpdate(@Res() response: Response, @Query('timestamp') timestamp?: number) {
    return this.clientCacheUpdateService.subscribeToCacheUpdate(response, timestamp);
  }
}
