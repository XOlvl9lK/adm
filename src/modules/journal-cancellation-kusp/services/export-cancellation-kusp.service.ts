import { ExcelServiceBase } from '@common/base/excel-service.base';
import { Injectable } from '@nestjs/common';
import { FindCancellationKuspService } from './find-cancellation-kusp.service';
import { ExportCancellationKuspDto } from '../controllers/dtos/export-cancellation-kusp.dto';
import { Response } from 'express';
import { CancellationKuspEntity } from '../domain/cancellation-kusp.entity';
import { ExcelHelper } from '../../excel/infrastructure/excel.helper';
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
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class ExportCancellationKuspService extends ExcelServiceBase {
  constructor(
    private findCancellationKuspService: FindCancellationKuspService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_аннулирования_КУСП_{date}_{index}',
      xls: 'Журнал_аннулирования_КУСП_{date}_{index}',
      ods: 'Журнал_аннулирования_КУСП_{date}_{index}',
      native: 'Журнал аннулирования КУСП',
    });
  }

  async exportXlsx(dto: ExportCancellationKuspDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportCancellationKuspWorker',
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
    return await this.exportFile(this.createExcel, dto, data, 'xlsx', response);
  }

  async exportXls(dto: ExportCancellationKuspDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportCancellationKuspWorker',
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
    return await this.exportFile(this.createExcel, dto, data, 'xls', response);
  }

  async exportOds(dto: ExportCancellationKuspDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportCancellationKuspWorker',
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
    return await this.exportFile(this.createExcel, dto, data, 'ods', response);
  }

  private createExcel(dto: ExportCancellationKuspDto, data: Array<CancellationKuspEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:J1')
      .subTitle('Журнал аннулирования КУСП', 'B2:J2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A8:K8',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .cells([
        { value: 'Дата и время операции:', index: 'B4' },
        { value: getRangeDateString(dto.operationDate?.[0], dto.operationDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Надзирающая прокуратура:', index: 'E4' },
        { value: transformAuthorities(dto.procuracyTitles)?.join(', ') || 'Все', index: 'F4' },
        { value: 'Дата формирования Выгрузки:', index: 'H4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'I4',
        },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: '№ КУСП:', index: 'E5' },
        { value: dto.kuspNumber || 'Не указано', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
        { value: dto.viewer || 'Не указано', index: 'I5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Вид операции:', index: 'E6' },
        { value: dto.operationTypeTitle?.join(', ') || 'Все', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Имя пользователя:', index: 'E7' },
        { value: dto.userLogin || 'Не указано', index: 'F7' },
      ])
      .columns([
        { key: 'number', width: 20 },
        { key: 'kuspNumber', width: 20 },
        { key: 'divisionTitle', width: 20 },
        { key: 'solutionTitle', width: 20 },
        { key: 'registrationDate', width: 20 },
        { key: 'versionDate', width: 20 },
        { key: 'operationDate', width: 20 },
        { key: 'operationTypeTitle', width: 20 },
        { key: 'userLogin', width: 20 },
        { key: 'comment', width: 20 },
      ])
      .header(
        [
          { title: '№ П/П', key: 'number' },
          { title: '№ КУСП', key: 'kuspNumber' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Решение', key: 'solutionTitle' },
          { title: 'Дата регистрации сообщения', key: 'registrationDate' },
          { title: 'Дата создания версии*', key: 'versionDate' },
          { title: 'Дата операции*', key: 'operationDate' },
          { title: 'Вид операции', key: 'operationTypeTitle' },
          { title: 'Пользователь', key: 'userLogin' },
          { title: 'Комментарий', key: 'comment' },
        ],
        10,
      )
      .fill(
        data.map((data, id) => ({
          ...data,
          number: id + 1,
          registrationDate: getClientDateAndTime(dto.timeZone, data.registrationDate),
          versionDate: getClientDateAndTime(dto.timeZone, data.versionDate),
          operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
        })),
        11,
      );
  }

  private async getData(dto: ExportCancellationKuspDto) {
    const result = dto.ids?.length
      ? await this.findCancellationKuspService.findByIds(dto.ids, dto.sort)
      : await this.findCancellationKuspService.findAll(dto);
    return result.data;
  }
}
