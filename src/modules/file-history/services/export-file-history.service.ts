import { ExcelServiceBase } from '@common/base/excel-service.base';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { Injectable } from '@nestjs/common';
import { FileHistoryEntity } from '../domain/file-history.entity';
import { FindFileHistoryByIdService } from './find-file-history-by-id.service';
import { Response } from 'express';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { FindAllFileHistory, FindAllFileHistoryService } from './find-all-file-history.service';
import { FileHistoryStatusEnum } from '../domain/file-history-status.enum';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';

export interface ExportFileHistory extends FindAllFileHistory {
  ids?: number[];
  columnKeys?: string[];
  timeZone?: string;
  viewer?: string;
}

@Injectable()
export class ExportFileHistoryService extends ExcelServiceBase {
  constructor(
    private findFileHistoryService: FindAllFileHistoryService,
    private findFileHistoryByIdService: FindFileHistoryByIdService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_Выгрузка_в_Файлы_{date}_{index}',
      xls: 'Журнал_Выгрузка_в_Файлы_{date}_{index}',
      ods: 'Журнал_Выгрузка_в_Файлы_{date}_{index}',
      native: 'Журнал выгрузок в файл',
    });
  }

  async exportXlsx(dto: ExportFileHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportFileHistoryWorker',
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

  async exportXls(dto: ExportFileHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportFileHistoryWorker',
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

  async exportOds(dto: ExportFileHistory, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportFileHistoryWorker',
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

  private createExcel(dto: ExportFileHistory, data: Array<FileHistoryEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
      .subTitle('Журнал выгрузок в файлы', 'A2:I2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A7:K7',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'startDate', width: 20 },
        { key: 'departmentTitle', width: 20 },
        { key: 'status', width: 20 },
        { key: 'fileUrl', width: 20 },
      ])
      .cells([
        { value: 'Наименование внешнего ОВ:', index: 'B4' },
        { value: dto.departmentName?.length ? dto.departmentName?.join(', ') : 'Все', index: 'C4' },
        { value: 'Статус запроса:', index: 'B5' },
        { value: dto.status?.length ? dto.status.join(',') : 'Все', index: 'C5' },
        { value: 'Дата и время начала:', index: 'B6' },
        {
          value: this.getStartDatePeriod(
            dto.startDate?.[0] ? new Date(dto.startDate?.[0]).toISOString() : '',
            dto.startDate?.[1] ? new Date(dto.startDate?.[1]).toISOString() : '',
            dto.timeZone,
          ),
          index: 'C6',
        },
        { value: 'Дата формирования выгрузки:', index: 'E4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'F4',
        },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'E5' },
        { value: dto.viewer || '', index: 'F5' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Дата и время начала*', key: 'startDate' },
          { title: 'Наименование внешнего ОВ', key: 'departmentTitle' },
          { title: 'Статус запроса', key: 'status' },
          { title: 'Файлы выгрузок', key: 'fileUrl' },
        ],
        9,
      )
      .fill(
        data.map((obj, idx) => ({
          ...obj,
          number: idx + 1,
          departmentTitle: obj.integration?.departmentName || 'Не указано',
          startDate: getClientDateAndTime(dto.timeZone, obj.startDate),
          plannedStartDate: getClientDateAndTime(dto.timeZone, obj.plannedStartDate),
          status: this.getStatus(obj.status),
        })),
        10,
      );
  }

  private getStatus(status?: FileHistoryStatusEnum) {
    const statusTranslations = {
      [FileHistoryStatusEnum.COMPLETED]: 'Выполнено',
      [FileHistoryStatusEnum.ERROR]: 'Ошибка',
      [FileHistoryStatusEnum.IN_PROCESS]: 'В процессе',
      [FileHistoryStatusEnum.COMPLETED_WITH_ERRORS]: 'Выполнено с ошибками',
    };
    return statusTranslations[status] || '';
  }

  private async getData(dto: ExportFileHistory) {
    const result = dto.ids?.length
      ? await this.findFileHistoryByIdService.handle(dto.ids, dto.sort)
      : await this.findFileHistoryService.handle(dto);
    return result.data;
  }

  private getStartDatePeriod(start = '', finish = '', timeZone = '0') {
    // eslint-disable-next-line max-len, prettier/prettier
    const formattedStart = start ? formatDate(applyTimezoneToDate(start, getUserTimezone(timeZone)), 'dd.MM.yyyy HH:mm:ss') : '';
    // eslint-disable-next-line max-len, prettier/prettier
    const formattedFinish = finish ? formatDate(applyTimezoneToDate(finish, getUserTimezone(timeZone)), 'dd.MM.yyyy HH:mm:ss') : '';
    if (!formattedStart && !formattedFinish) return 'Всё';
    if (!formattedStart && formattedFinish) return `до ${formattedFinish}`;
    if (formattedStart && !formattedFinish) return `с ${formattedStart}`;
    return `${formattedStart} - ${formattedFinish}`;
  }
}
