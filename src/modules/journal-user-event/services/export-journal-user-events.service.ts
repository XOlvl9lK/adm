import { Injectable } from '@nestjs/common';
import { FindJournalUserEventsService } from './find-journal-user-events.service';
import { Response } from 'express';
import { ExcelHelper } from '../../excel/infrastructure/excel.helper';
import { JournalUserEventsEntity } from '../domain/journal-user-events.entity';
import { ExportUserEventDto } from '@modules/journal-user-event/controllers/dtos/export-user-event.dto';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class ExportJournalUserEventsService extends ExcelServiceBase {
  constructor(
    private findUserEventService: FindJournalUserEventsService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_действий_пользователей_{date}_{index}',
      xls: 'Журнал_действий_пользователей_{date}_{index}',
      ods: 'Журнал_действий_пользователей_{date}_{index}',
      native: 'Журнал действий пользователей',
    });
  }

  async exportXlsx(exportUserEventDto: ExportUserEventDto, response: Response, token?: string) {
    if (exportUserEventDto.pageSize && exportUserEventDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportUserEventDto.timeZone, exportUserEventDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportUserEventDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalUserEvents',
        {
          dto: exportUserEventDto,
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

    const data = await this.getData(exportUserEventDto);
    return await this.exportFile(this.createExcel, exportUserEventDto, data, 'xlsx', response);
  }

  async exportXls(exportUserEventDto: ExportUserEventDto, response: Response, token?: string) {
    if (exportUserEventDto.pageSize && exportUserEventDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportUserEventDto.timeZone, exportUserEventDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportUserEventDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalUserEvents',
        {
          dto: exportUserEventDto,
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

    const data = await this.getData(exportUserEventDto);
    return await this.exportFile(this.createExcel, exportUserEventDto, data, 'xls', response);
  }

  async exportOds(exportUserEventDto: ExportUserEventDto, response: Response, token?: string) {
    if (exportUserEventDto.pageSize && exportUserEventDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportUserEventDto.timeZone, exportUserEventDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportUserEventDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalUserEvents',
        {
          dto: exportUserEventDto,
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

    const data = await this.getData(exportUserEventDto);
    return await this.exportFile(this.createExcel, exportUserEventDto, data, 'ods', response);
  }

  private createExcel(dto: ExportUserEventDto, data: Array<JournalUserEventsEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:J1')
      .subTitle('Журнал действий пользователей', 'B2:J2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A8:K8',
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'regionTitle', width: 30 },
        { key: 'departmentTitle', width: 30 },
        { key: 'divisionTitle', width: 30 },
        { key: 'userLogin', width: 30 },
        { key: 'url', width: 25 },
        { key: 'browserVersion', width: 25 },
        { key: 'eventDate', width: 25 },
        { key: 'ipAddress', width: 20 },
        { key: 'resultTitle', width: 25 },
        { key: 'queryParam', width: 25 },
      ])
      .cells([
        { value: 'Период:', index: 'B4' },
        { value: getRangeDateString(dto.eventDate?.[0], dto.eventDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Имя пользователя:', index: 'E4' },
        { value: dto?.userLogin || 'Не указано', index: 'F4' },
        { value: 'Дата формирования выгрузки:', index: 'J4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'K4',
        },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Версия браузера:', index: 'E5' },
        { value: dto?.browserVersion || 'Не указано', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'J5' },
        { value: dto.viewer || 'Не указано', index: 'K5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'IP-адрес клиента:', index: 'E6' },
        { value: dto?.ipAddress || 'Не указано', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: `Результат обработки:`, index: 'E7' },
        { value: dto.result?.join(', ') || 'Все', index: 'F7' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Регион', key: 'regionTitle' },
          { title: 'Ведомство', key: 'departmentTitle' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Имя пользователя', key: 'userLogin' },
          { title: 'URL', key: 'url' },
          { title: 'Версия браузера', key: 'browserVersion' },
          { title: 'Дата и время события*', key: 'eventDate' },
          { title: 'IP адрес клиента', key: 'ipAddress' },
          { title: 'Результат обработки', key: 'resultTitle' },
          { title: 'Параметры запроса', key: 'queryParam' },
        ],
        10,
      )
      .fill(
        data.map((data, idx) => ({
          ...data,
          number: idx + 1,
          eventDate: getClientDateAndTime(dto.timeZone, data.eventDate),
        })),
        11,
      );
  }

  private async getData(dto: ExportUserEventDto) {
    if (dto.ids?.length) {
      return (await this.findUserEventService.findByIds(dto.ids, dto.sort)).data;
    }
    return (await this.findUserEventService.findAll(dto)).data;
  }
}
