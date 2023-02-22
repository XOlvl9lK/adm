import { Injectable } from '@nestjs/common';
import { FindNsiChangeService } from '../services/find-nsi-change.service';
import { ExportNsiChangeDto } from '../controllers/dto/export-nsi-change.dto';
import { NsiChangeEntity } from '../domain/nsi-change.entity';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { Response } from 'express';
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
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';

@Injectable()
export class ExportNsiChangeService extends ExcelServiceBase {
  constructor(
    private findNsiChangeService: FindNsiChangeService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_изменений_НСИ_{date}_{index}',
      xls: 'Журнал_изменений_НСИ_{date}_{index}',
      ods: 'Журнал_изменений_НСИ_{date}_{index}',
      native: 'Журнал изменений НСИ',
    });
  }

  async exportXlsx(exportNsiChangeDto: ExportNsiChangeDto, response: Response, token?: string) {
    if (exportNsiChangeDto.pageSize && exportNsiChangeDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportNsiChangeDto.timeZone, exportNsiChangeDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportNsiChangeDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportNsiChangeWorker',
        {
          dto: exportNsiChangeDto,
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

    const data = await this.getData(exportNsiChangeDto);
    return await this.exportFile(this.createExcel, exportNsiChangeDto, data, 'xlsx', response);
  }

  async exportXls(exportNsiChangeDto: ExportNsiChangeDto, response: Response, token?: string) {
    if (exportNsiChangeDto.pageSize && exportNsiChangeDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportNsiChangeDto.timeZone, exportNsiChangeDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportNsiChangeDto, 'xls', createdJob);
      this.workerService.run(
        'exportNsiChangeWorker',
        {
          dto: exportNsiChangeDto,
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

    const data = await this.getData(exportNsiChangeDto);
    return await this.exportFile(this.createExcel, exportNsiChangeDto, data, 'xls', response);
  }

  async exportOds(exportNsiChangeDto: ExportNsiChangeDto, response: Response, token?: string) {
    if (exportNsiChangeDto.pageSize && exportNsiChangeDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, exportNsiChangeDto.timeZone, exportNsiChangeDto.eventDate),
      );
      await this.createTemporaryFile(this.createExcel, exportNsiChangeDto, 'ods', createdJob);
      this.workerService.run(
        'exportNsiChangeWorker',
        {
          dto: exportNsiChangeDto,
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

    const data = await this.getData(exportNsiChangeDto);
    return await this.exportFile(this.createExcel, exportNsiChangeDto, data, 'ods', response);
  }

  private createExcel(dto: ExportNsiChangeDto, data: Array<NsiChangeEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
      .subTitle('Журнал изменений НСИ', 'A2:I2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A7:K7',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'eventDate', width: 20 },
        { key: 'userName', width: 20 },
        { key: 'ipAddress', width: 20 },
        { key: 'sessionId', width: 25 },
        { key: 'objectTitle', width: 20 },
        { key: 'eventTitle', width: 20 },
      ])
      .columnWidth({
        H: 20,
        I: 20,
      })
      .cells([
        { value: 'Период:', index: 'B4' },
        { value: getRangeDateString(dto.eventDate?.[0], dto.eventDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Объект:', index: 'E4' },
        { value: dto.objectTitle?.join(', ') || 'Все', index: 'F4' },
        { value: 'Дата формирования выгрузки:', index: 'H4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'I4',
        },
        { value: 'ФИО пользователя:', index: 'B5' },
        { value: dto.userName || 'Не указано', index: 'C5' },
        { value: 'Действие:', index: 'E5' },
        { value: dto.eventTitle?.join(', ') || 'Все', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку', index: 'H5' },
        { value: dto.viewer || 'Не указано', index: 'I5' },
        { value: 'IP адрес:', index: 'B6' },
        { value: dto.ipAddress || 'Не указано', index: 'C6' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Дата и время изменения*', key: 'eventDate' },
          { title: 'ФИО пользователя', key: 'userName' },
          { title: 'IP-адрес', key: 'ipAddress' },
          { title: 'Идентификатор сессии', key: 'sessionId' },
          { title: 'Объект', key: 'objectTitle' },
          { title: 'Действие', key: 'eventTitle' },
        ],
        9,
      )
      .fill(
        data.map((data, idx) => ({
          ...data,
          number: idx + 1,
          eventDate: getClientDateAndTime(dto.timeZone, data.eventDate),
        })),
        10,
      );
  }

  private async getData(dto: ExportNsiChangeDto) {
    const result = await (dto.ids?.length
      ? this.findNsiChangeService.findByIds(dto.ids, dto.sort)
      : this.findNsiChangeService.findAll(dto));
    return result.data;
  }
}
