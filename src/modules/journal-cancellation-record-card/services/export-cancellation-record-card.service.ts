import { ExcelServiceBase } from '@common/base/excel-service.base';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { Injectable } from '@nestjs/common';
import { FindCancellationRecordCardService } from './find-cancellation-record-card.service';
import { ExportCancellationRecordCardDto } from '../controllers/dto/export-cancellation-record-card.dto';
import { CancellationRecordCardEntity } from '../domain/cancellation-record-card.entity';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { Response } from 'express';
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
export class ExportCancellationRecordCardService extends ExcelServiceBase {
  constructor(
    private findCancellationRecordCardService: FindCancellationRecordCardService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_аннулирования_учётных_карточек_{date}_{index}',
      xls: 'Журнал_аннулирования_учётных_карточек_{date}_{index}',
      ods: 'Журнал_аннулирования_учётных_карточек_{date}_{index}',
      native: 'Журнал аннулирования учётных карточек',
    });
  }

  async exportXlsx(dto: ExportCancellationRecordCardDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportCancellationRecordCardWorker',
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

  async exportXls(dto: ExportCancellationRecordCardDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportCancellationRecordCardWorker',
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

  async exportOds(dto: ExportCancellationRecordCardDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportCancellationRecordCardWorker',
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

  private createExcel(
    dto: ExportCancellationRecordCardDto,
    data: Array<CancellationRecordCardEntity & { id: string }>,
  ) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
      .subTitle('Журнал аннулирования учётных карточек', 'A2:I2')
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
        { value: 'Номер проверки:', index: 'D4' },
        { value: dto.uniqueNumber || 'Не указано', index: 'E4' },
        { value: 'Дата формирования выгрузки:', index: 'H4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'I4',
        },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Вид операции:', index: 'D5' },
        { value: dto.operationTypeTitle?.join(', ') || 'Все', index: 'E5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
        { value: dto.viewer || 'Не указано', index: 'I5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Номер формы:', index: 'D6' },
        { value: dto.formNumber?.join(', ') || 'Все', index: 'E6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Мера реагирования:', index: 'D7' },
        {
          value: dto.responseMeasureTitles ? transformAuthorities(dto.responseMeasureTitles)?.join(', ') : 'Все',
          index: 'E7',
        },
      ])
      .columns([
        { key: 'number', width: 20 },
        { key: 'uniqueNumber', width: 20 },
        { key: 'cardId', width: 20 },
        { key: 'operationDate', width: 20 },
        { key: 'divisionTitle', width: 20 },
        { key: 'formNumber', width: 20 },
        { key: 'operationTypeTitle', width: 20 },
        { key: 'comment', width: 20 },
        { key: 'userLogin', width: 20 },
      ])
      .header(
        [
          { title: '№ П/П', key: 'number' },
          { title: 'Уникальный номер', key: 'uniqueNumber' },
          { title: 'Идентификатор карточки', key: 'cardId' },
          { title: 'Дата начала проверки/выявления нарушения/внесение меры реагирования*', key: 'operationDate' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Номер формы', key: 'formNumber' },
          { title: 'Вид операции', key: 'operationTypeTitle' },
          { title: 'Комментарий', key: 'comment' },
          { title: 'Пользователь', key: 'userLogin' },
        ],
        10,
      )
      .fill(
        data.map((data, id) => ({
          ...data,
          number: id + 1,
          operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
        })),
        11,
      );
  }

  async getData(dto: ExportCancellationRecordCardDto) {
    const result = dto.ids?.length
      ? await this.findCancellationRecordCardService.findByIds(dto.ids, dto.sort)
      : await this.findCancellationRecordCardService.findAll(dto);
    return result.data;
  }
}
