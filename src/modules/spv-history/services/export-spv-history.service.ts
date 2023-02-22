import { ExcelServiceBase } from '@common/base/excel-service.base';
import { Injectable } from '@nestjs/common';
import { FindSpvHistoryService } from './find-spv-history.service';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { Response } from 'express';
import { SpvHistoryEntity } from '../domain/spv-history.entity';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { SpvMethodNameEnum } from '../domain/spv-method-name.enum';
import { RequestStateEnum, RequestStateEnumTranslated } from '../domain/request-state.enum';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { SortQuery } from '@common/utils/types';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';

export interface ExportSpvHistory {
  departmentName?: string[];
  methodName?: SpvMethodNameEnum[];
  requestState?: RequestStateEnum[];
  startDate?: [string, string];
  ids?: string[];
  columnKeys?: string[];
  timeZone?: string;
  sort?: SortQuery;
  viewer?: string;
  pageSize?: number;
}

@Injectable()
export class ExportSpvHistoryService extends ExcelServiceBase {
  constructor(
    private findSpvHistoryService: FindSpvHistoryService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: `Журнал_СПВ_{date}_{index}`,
      xls: `Журнал_СПВ_{date}_{index}`,
      ods: `Журнал_СПВ_{date}_{index}`,
      native: 'Журнал СПВ',
    });
  }

  async exportXlsx(dto: ExportSpvHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportSpvHistoryWorker',
        {
          dto: dto,
          exportJob: createdJob,
          format: 'xlsx',
          token,
        },
        (fileName: string) => {
          if (fileName) {
            this.updateExportJobService.update({
              jobId: createdJob.id,
              token,
              status: ExportJobStatusEnum.DONE,
              link: getExportJobLink(fileName),
            })
          }
        },
      );
      return response.json(createdJob);
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel.bind(this), dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportSpvHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportSpvHistoryWorker',
        {
          dto: dto,
          exportJob: createdJob,
          format: 'xls',
          token,
        },
        (fileName: string) => {
          if (fileName) {
            this.updateExportJobService.update({
              jobId: createdJob.id,
              token,
              status: ExportJobStatusEnum.DONE,
              link: getExportJobLink(fileName),
            })
          }
        },
      );
      return response.json(createdJob);
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel.bind(this), dto, data, 'xls', response);
  }

  async exportOds(dto: ExportSpvHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportSpvHistoryWorker',
        {
          dto: dto,
          exportJob: createdJob,
          format: 'ods',
          token,
        },
        (fileName: string) => {
          if (fileName) {
            this.updateExportJobService.update({
              jobId: createdJob.id,
              token,
              status: ExportJobStatusEnum.DONE,
              link: getExportJobLink(fileName),
            })
          }
        },
      );
      return response.json(createdJob);
    }

    const data = await this.getData(dto);
    return await this.exportFile(this.createExcel.bind(this), dto, data, 'ods', response);
  }

  private createExcel(dto: ExportSpvHistory, data: Array<SpvHistoryEntity & { id: string }>) {
    const dateTime = this.formatPeriodDateTime(dto.startDate?.[0], dto.startDate?.[1], dto.timeZone);
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
      .subTitle('Журнал СПВ', 'A2:I2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A8:K8',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'startDate', width: 20 },
        { key: 'finishDate', width: 20 },
        { key: 'integrationName', width: 20 },
        { key: 'uniqueSecurityKey', width: 25 },
        { key: 'requestMethod', width: 20 },
        { key: 'requestState', width: 20 },
        { key: 'requestXmlUrl', width: 20 },
        { key: 'responseXmlUrl', width: 20 },
      ])
      .cells([
        { value: 'Наименование внешнего ОВ:', index: 'B4' },
        { value: dto.departmentName && dto.departmentName.length ? dto.departmentName.join(', ') : 'Все', index: 'C4' },
        { value: 'Тип запроса:', index: 'B6' },
        { value: dto.methodName && dto.methodName.length ? dto.methodName.join(', ') : 'Все', index: 'C6' },
        { value: 'Статус запроса:', index: 'B7' },
        {
          value:
            dto.requestState && dto.requestState.length
              ? dto.requestState.map((r) => RequestStateEnumTranslated[r]).join(', ')
              : 'Все',
          index: 'C7',
        },
        { value: 'Дата и время начала:', index: 'B5' },
        { value: dateTime, index: 'C5' },
        { value: 'Дата формирования выгрузки:', index: 'H4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'I4',
        },
        { value: 'Пользователь, сформировавший выгрузку', index: 'H5' },
        { value: dto.viewer, index: 'I5' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Дата и время начала*', key: 'startDate' },
          { title: 'Дата и время окончания*', key: 'finishDate' },
          { title: 'Наименование внешнего ОВ', key: 'integrationName' },
          { title: 'Ключ безопасности', key: 'uniqueSecurityKey' },
          { title: 'Тип запроса', key: 'requestMethod' },
          { title: 'Статус запроса', key: 'requestState' },
          { title: 'XML запроса', key: 'requestXmlUrl' },
          { title: 'XML ответа', key: 'responseXmlUrl' },
        ],
        10,
      )
      .fill(
        data.map((obj, idx) => ({
          ...obj,
          number: idx + 1,
          requestMethod: obj.requestMethod?.name || '',
          requestState: RequestStateEnumTranslated[obj.requestState],
          startDate: getClientDateAndTime(dto.timeZone, obj.startDate),
          finishDate: getClientDateAndTime(dto.timeZone, obj.finishDate),
        })),
        11,
      );
  }

  private formatPeriodDateTime(from?: string, to?: string, timezone?: string) {
    // eslint-disable-next-line max-len, prettier/prettier
    const _from = from ? formatDate(applyTimezoneToDate(from, getUserTimezone(timezone || '0')), 'dd.MM.yyyy') : '';
    const _to = to ? formatDate(applyTimezoneToDate(to, getUserTimezone(timezone || '0')), 'dd.MM.yyyy') : '';
    if (!_from && !_to) return 'Всё';
    if (_from && !_to) return `От ${from}`;
    if (!_from && _to) return `До ${to}`;
    return `${_from} - ${_to}`;
  }

  private async getData(dto: ExportSpvHistory) {
    const result = dto.ids?.length
      ? await this.findSpvHistoryService.findByIds(dto.ids, dto.sort)
      : await this.findSpvHistoryService.findAll(dto);
    return result.data;
  }
}
