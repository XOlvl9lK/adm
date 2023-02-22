import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { ExportSmevHistoryDto } from '@modules/smev-history/controllers/dtos/export-smev-history.dto';
import { Response } from 'express';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { SmevHistoryStateTranslated } from '../domain/smev-history-state.enum';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';

@Injectable()
export class ExportSmevHistoryService extends ExcelServiceBase {
  constructor(
    private findSmevHistoryService: FindSmevHistoryService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_СМЭВ_{date}_{index}',
      xls: 'Журнал_СМЭВ_{date}_{index}',
      ods: 'Журнал_СМЭВ_{date}_{index}',
      native: 'Журнал СМЭВ',
    });
  }

  async exportXlsx(dto: ExportSmevHistoryDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportSmevHistoryWorker',
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

  async exportXls(dto: ExportSmevHistoryDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportSmevHistoryWorker',
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

  async exportOds(dto: ExportSmevHistoryDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportSmevHistoryWorker',
        {
          dto: dto,
          exportJob: createdJob,
          format: 'ods',
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

  private createExcel(dto: ExportSmevHistoryDto, data: SmevHistoryEntity[]) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:M1')
      .subTitle('Журнал действий пользователей', 'A2:M2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A8:K8',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'createDate', width: 20 },
        { key: 'updateDate', width: 20 },
        { key: 'departmentName', width: 20 },
        { key: 'methodName', width: 20 },
        { key: 'state', width: 20 },
        { key: 'getTaskRequest', width: 20 },
        { key: 'getTaskResponse', width: 20 },
        { key: 'ackRequest', width: 20 },
        { key: 'ackResponse', width: 20 },
        { key: 'sendTaskRequestWithSignature', width: 20 },
        { key: 'sendTaskResponse', width: 20 },
      ])
      .cells([
        { value: 'Дата и время начала:', index: 'B4' },
        { value: getRangeDateString(dto.createDate?.[0], dto.createDate?.[1]), index: 'C4' },
        { value: 'Дата формирования выгрузки:', index: 'L4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'M4',
        },
        { value: 'Наименование внешнего ОВ:', index: 'B5' },
        { value: dto.departmentName?.join(', ') || 'Все', index: 'C5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'L5' },
        { value: dto.viewer || 'Не указано', index: 'M5' },
        { value: 'Статус запроса:', index: 'B6' },
        { value: dto.state?.map((s) => SmevHistoryStateTranslated[s]).join(', ') || 'Все', index: 'C6' },
        { value: 'Тип запроса:', index: 'B7' },
        { value: dto.methodName?.join(', ') || 'Все', index: 'C7' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Дата и время начала*', key: 'createDate' },
          { title: 'Дата и время окончания*', key: 'updateDate' },
          { title: 'Наименование внешнего ОВ', key: 'departmentName' },
          { title: 'Тип запроса', key: 'methodName' },
          { title: 'Статус запроса', key: 'state' },
          { title: 'Получение задачи. XML запроса', key: 'getTaskRequest' },
          { title: 'Получение задачи. XML ответа', key: 'getTaskResponse' },
          { title: 'Подтверждение получения задачи. XML запроса', key: 'ackRequest' },
          { title: 'Подтверждение получения задачи. XML ответа', key: 'ackResponse' },
          { title: 'Решение задачи. XML запроса', key: 'sendTaskRequestWithSignature' },
          { title: 'Решение задачи. XML ответа', key: 'sendTaskResponse' },
        ],
        11,
      )
      .fill(
        data.map((data, idx) => ({
          ...data,
          number: idx + 1,
          departmentName: data.integration?.departmentName,
          createDate: getClientDateAndTime(dto.timeZone, data.createDate),
          updateDate: getClientDateAndTime(dto.timeZone, data.updateDate),
          state: data.state ? SmevHistoryStateTranslated[data.state] : '',
        })),
        12,
      );
  }

  private async getData(dto: ExportSmevHistoryDto) {
    if (dto.ids?.length) {
      return (
        await this.findSmevHistoryService.findByIds(
          dto.ids.map((id) => Number(id)),
          dto.sort,
        )
      ).data;
    }
    return (await this.findSmevHistoryService.findAll(dto)).data;
  }
}
