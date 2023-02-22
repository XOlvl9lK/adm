import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@common/base/excel-service.base';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/export-journal-loading-unloading.dto';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingEntity } from '@modules/journal-loading-unloading/domain/journal-loading-unloading.entity';
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
import { ShowEnumTranslated } from '../controllers/dtos/find-journal-loading-unloading.dto';

@Injectable()
export class ExportJournalLoadingUnloadingService extends ExcelServiceBase {
  constructor(
    private findJournalLoadingUnloadingService: FindJournalLoadingUnloadingService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_выгрузки_и_загрузки_{date}_{index}',
      xls: 'Журнал_выгрузки_и_загрузки_{date}_{index}',
      ods: 'Журнал_выгрузки_и_загрузки_{date}_{index}',
      native: 'Журнал выгрузки и загрузки',
    });
  }

  async exportXlsx(journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto, response: Response, token?: string) {
    if (journalLoadingUnloadingDto.pageSize && journalLoadingUnloadingDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          journalLoadingUnloadingDto.timeZone,
          journalLoadingUnloadingDto.importDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, journalLoadingUnloadingDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalUserEvents',
        {
          dto: journalLoadingUnloadingDto,
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

    const data = await this.getData(journalLoadingUnloadingDto);
    return await this.exportFile(this.createExcel, journalLoadingUnloadingDto, data, 'xlsx', response);
  }

  async exportXls(journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto, response: Response, token?: string) {
    if (journalLoadingUnloadingDto.pageSize && journalLoadingUnloadingDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          journalLoadingUnloadingDto.timeZone,
          journalLoadingUnloadingDto.importDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, journalLoadingUnloadingDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalUserEvents',
        {
          dto: journalLoadingUnloadingDto,
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

    const data = await this.getData(journalLoadingUnloadingDto);
    return await this.exportFile(this.createExcel, journalLoadingUnloadingDto, data, 'xls', response);
  }

  async exportOds(journalLoadingUnloadingDto: ExportJournalLoadingUnloadingDto, response: Response, token?: string) {
    if (journalLoadingUnloadingDto.pageSize && journalLoadingUnloadingDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          journalLoadingUnloadingDto.timeZone,
          journalLoadingUnloadingDto.importDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, journalLoadingUnloadingDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalLoadingUnloadingWorker',
        {
          dto: journalLoadingUnloadingDto,
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

    const data = await this.getData(journalLoadingUnloadingDto);
    return await this.exportFile(this.createExcel, journalLoadingUnloadingDto, data, 'ods', response);
  }

  private async getData(dto: ExportJournalLoadingUnloadingDto) {
    if (dto.ids?.length) {
      return (await this.findJournalLoadingUnloadingService.findByIds(dto.ids, dto.sort)).data;
    }
    return (await this.findJournalLoadingUnloadingService.findAll(dto)).data;
  }

  private createExcel(
    dto: ExportJournalLoadingUnloadingDto,
    data: Array<JournalLoadingUnloadingEntity & { id: string }>,
  ) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:G1')
      .subTitle('Журнал выгрузки и загрузки', 'B2:G2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A7:K7',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'importDate', width: 25 },
        { key: 'exportDate', width: 25 },
        { key: 'fileTitle', width: 30 },
        { key: 'allCardsNumber', width: 25 },
        { key: 'processingResultTitle', width: 25 },
        { key: 'downloadedCardsNumber', width: 25 },
        { key: 'errorProcessedCardsNumber', width: 25 },
      ])
      .cells([
        { value: 'Дата и время выгрузки:', index: 'B4' },
        { value: getRangeDateString(dto.exportDate?.[0], dto.exportDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Наименование файла:', index: 'E4' },
        { value: dto.fileTitle || 'Не указано', index: 'F4' },
        { value: 'Дата формирования выгрузки:', index: 'H4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'I4',
        },
        { value: 'Дата и время загрузки:', index: 'B5' },
        { value: getRangeDateString(dto.importDate?.[0], dto.importDate?.[1]), index: 'C5' },
        { value: 'Результат обработки:', index: 'E5' },
        { value: dto.processingResult?.join(', ') || 'Все', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
        { value: dto.viewer || 'Не указано', index: 'I5' },
        { value: 'Отображать:', index: 'E6' },
        { value: dto.show?.map((e) => ShowEnumTranslated[e]).join(',') || 'Все', index: 'F6' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Дата и время загрузки', key: 'importDate' },
          { title: 'Дата и время выгрузки', key: 'exportDate' },
          { title: 'Наименование файла', key: 'fileTitle' },
          { title: 'Количество карточек', key: 'allCardsNumber' },
          { title: 'Результат обработки', key: 'processingResultTitle' },
          { title: 'Загружено карточек', key: 'downloadedCardsNumber' },
          { title: 'Обработано с ошибками', key: 'errorProcessedCardsNumber' },
        ],
        9,
      )
      .fill(
        data.map((d, idx) => ({
          ...d,
          number: idx + 1,
          importDate: getClientDateAndTime(dto.timeZone, d.importDate),
          exportDate: getClientDateAndTime(dto.timeZone, d.exportDate),
        })),
        10,
      );
  }
}
