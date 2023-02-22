import { Injectable } from '@nestjs/common';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { ExportJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/export-journal-kusp.dto';
import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { JournalKuspEntity } from '@modules/journal-kusp/domain/journal-kusp.entity';
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
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class ExportJournalKuspService extends ExcelServiceBase {
  constructor(
    private findJournalKuspService: FindJournalKuspService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_обработки_КУСП_{date}_{index}',
      xls: 'Журнал_обработки_КУСП_{date}_{index}',
      ods: 'Журнал_обработки_КУСП_{date}_{index}',
      native: 'Журнал обработки КУСП',
    });
  }

  async exportXlsx(journalKuspDto: ExportJournalKuspDto, response: Response, token?: string) {
    if (journalKuspDto.pageSize && journalKuspDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalKuspDto.timeZone, journalKuspDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalKuspDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalKuspWorker',
        {
          dto: journalKuspDto,
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

    const { data } = await this.getData(journalKuspDto);
    return await this.exportFile(this.createExcel, journalKuspDto, data, 'xlsx', response);
  }

  async exportXls(journalKuspDto: ExportJournalKuspDto, response: Response, token?: string) {
    if (journalKuspDto.pageSize && journalKuspDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalKuspDto.timeZone, journalKuspDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalKuspDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalKuspWorker',
        {
          dto: journalKuspDto,
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

    const { data } = await this.getData(journalKuspDto);
    return await this.exportFile(this.createExcel, journalKuspDto, data, 'xls', response);
  }

  async exportOds(journalKuspDto: ExportJournalKuspDto, response: Response, token?: string) {
    if (journalKuspDto.pageSize && journalKuspDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalKuspDto.timeZone, journalKuspDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalKuspDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalKuspWorker',
        {
          dto: journalKuspDto,
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

    const { data } = await this.getData(journalKuspDto);
    return await this.exportFile(this.createExcel, journalKuspDto, data, 'ods', response);
  }

  private async getData(dto: ExportJournalKuspDto) {
    return await (dto.ids?.length
      ? this.findJournalKuspService.findByIds(dto.ids, dto.sort)
      : this.findJournalKuspService.findAll(dto));
  }

  private createExcel(dto: ExportJournalKuspDto, data: Array<JournalKuspEntity & { id: string }>) {
    const normalizedData = data.map((d, idx) => ({
      ...d,
      number: idx + 1,
      createDate: getClientDateAndTime(dto.timeZone, d.createDate),
      startProcessingDate: getClientDateAndTime(dto.timeZone, d.startProcessingDate),
      endProcessingDate: getClientDateAndTime(dto.timeZone, d.endProcessingDate),
      signer: d.signer
        ?.map((s) => `${`${s.role}:` || ''} ${s.fullName || ''} ${s.position || ''} ${s.divisionTitle || ''}`)
        .join('\n'),
    }));
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:N1')
      .subTitle('Журнал обработки КУСП', 'A2:N2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A10:K10',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'divisionTitle', width: 20 },
        { key: 'regionTitle', width: 20 },
        { key: 'fileTitle', width: 20 },
        { key: 'packageKuspId', width: 20 },
        { key: 'createDate', width: 25 },
        { key: 'allPackageRecordsNumber', width: 20 },
        { key: 'downloadedRecordsNumber', width: 20 },
        { key: 'errorProcessedRecordsNumber', width: 20 },
        { key: 'sourceTitle', width: 20 },
        { key: 'startProcessingDate', width: 20 },
        { key: 'endProcessingDate', width: 20 },
        { key: 'signer', width: 20 },
        { key: 'operatorLogin', width: 20 },
        { key: 'statusTitle', width: 20 },
      ])
      .cells([
        { value: 'Дата и время загрузки:', index: 'B4' },
        {
          value: getRangeDateString(dto.startProcessingDate?.[0], dto.startProcessingDate?.[1], dto.timeZone),
          index: 'C4',
        },
        { value: 'Статус:', index: 'E4' },
        { value: dto.statuses?.join(', ') || 'Все', index: 'F4' },
        { value: 'Дата формирования выгрузки:', index: 'M4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'N4',
        },
        { value: 'Ведомство, сформировавшее пакет КУСП', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Вид пакета:', index: 'E5' },
        { value: dto.packageTypes?.join(', ') || 'Все', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'M5' },
        { value: dto.viewer || 'Не указано', index: 'N5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Источник:', index: 'E6' },
        { value: dto.sources?.join(', ') || 'Все', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Оператор:', index: 'E7' },
        { value: dto.operatorLogin || 'Не указано', index: 'F7' },
        { value: 'Наименование пакета:', index: 'B8' },
        { value: dto.fileTitle || 'Не указано', index: 'C8' },
        { value: 'Фамилия подписанта:', index: 'E8' },
        { value: dto.signerName || 'Не указано', index: 'F8' },
        { value: 'Номер КУСП', index: 'B9' },
        { value: dto.kuspNumber || 'Не указано', index: 'C9' },
      ])
      .columnWidth({
        M: 20,
        N: 20,
      })
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Регион', key: 'regionTitle' },
          { title: 'Имя файла', key: 'fileTitle' },
          { title: 'Идентификатор', key: 'packageKuspId' },
          { title: 'Дата и время создания*', key: 'createDate' },
          { title: 'Количество записей', key: 'allPackageRecordsNumber' },
          { title: 'Загружено', key: 'downloadedRecordsNumber' },
          { title: 'Обработано с ошибками', key: 'errorProcessedRecordsNumber' },
          { title: 'Источник', key: 'sourceTitle' },
          { title: 'Время начала обработки*', key: 'startProcessingDate' },
          { title: 'Время окончания обработки*', key: 'endProcessingDate' },
          { title: 'Подписанты', key: 'signer' },
          { title: 'Оператор', key: 'operatorLogin' },
          { title: 'Статус', key: 'statusTitle' },
        ],
        12,
      )
      .fill(normalizedData, 13);
  }
}
