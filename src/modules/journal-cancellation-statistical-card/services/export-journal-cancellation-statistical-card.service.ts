import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@common/base/excel-service.base';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { Response } from 'express';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/export-journal-cancellation-statistical-card.dto';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardEntity } from '@modules/journal-cancellation-statistical-card/domain/journal-cancellation-statistical-card.entity';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class ExportJournalCancellationStatisticalCardService extends ExcelServiceBase {
  constructor(
    private findJournalCancellationStatisticalCardService: FindJournalCancellationStatisticalCardService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_аннулирования_статистических_карточек_{date}_{index}',
      xls: 'Журнал_аннулирования_статистических_карточек_{date}_{index}',
      ods: 'Журнал_аннулирования_статистических_карточек_{date}_{index}',
      native: 'Журнал аннулирования статистических карточек',
    });
  }

  async exportXlsx(journalDto: ExportJournalCancellationStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalCancellationStatisticalCardWorker',
        {
          dto: journalDto,
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

    const data = await this.getData(journalDto);
    return await this.exportFile(this.createExcel, journalDto, data, 'xlsx', response);
  }

  async exportXls(journalDto: ExportJournalCancellationStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalCancellationStatisticalCardWorker',
        {
          dto: journalDto,
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

    const data = await this.getData(journalDto);
    return await this.exportFile(this.createExcel, journalDto, data, 'xls', response);
  }

  async exportOds(journalDto: ExportJournalCancellationStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalCancellationStatisticalCardWorker',
        {
          dto: journalDto,
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

    const data = await this.getData(journalDto);
    return await this.exportFile(this.createExcel, journalDto, data, 'ods', response);
  }

  private async getData(journalDto: ExportJournalCancellationStatisticalCardDto) {
    if (journalDto.ids?.length) {
      return (await this.findJournalCancellationStatisticalCardService.findByIds(journalDto.ids, journalDto.sort)).data;
    }
    return (await this.findJournalCancellationStatisticalCardService.findAll(journalDto)).data;
  }

  private createExcel(
    journalDto: ExportJournalCancellationStatisticalCardDto,
    data: Array<JournalCancellationStatisticalCardEntity & { id: string }>,
  ) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
      .subTitle('Журнал аннулирования статистических карточек', 'A2:I2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A9:K9',
        false,
      )
      .applyColumnOrdering(journalDto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'ikud', width: 20 },
        { key: 'uniqueNumber', width: 20 },
        { key: 'formNumber', width: 20 },
        { key: 'cardId', width: 25 },
        { key: 'sourceTitle', width: 25 },
        { key: 'versionDate', width: 30 },
        { key: 'operationDate', width: 20 },
        { key: 'operationTypeTitle', width: 20 },
        { key: 'userLogin', width: 25 },
        { key: 'comment', width: 20 },
      ])
      .cells([
        { value: 'Дата и время операции:', index: 'B4' },
        {
          value: getRangeDateString(journalDto.operationDate?.[0], journalDto.operationDate?.[1], journalDto.timeZone),
          index: 'C4',
        },
        { value: 'ИКУД:', index: 'E4' },
        { value: journalDto.ikud || 'Не указано', index: 'F4' },
        { value: 'Дата формирования выгрузки', index: 'H4' },
        { value: getClientDateAndTime(journalDto.timeZone, new Date().toISOString()), index: 'I4' },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(journalDto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Идентификатор карточки:', index: 'E5' },
        { value: journalDto?.cardId || 'Не указано', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
        { value: journalDto.viewer || 'Не указано', index: 'I5' },
        { value: 'Регион:', index: 'B6' },
        { value: journalDto.userHasChangedDivisionTitles ? journalDto.regionTitles?.join(', ') : 'Все', index: 'C6' },
        { value: 'Вид операции:', index: 'E6' },
        { value: journalDto?.operationTypeTitle?.join(', ') || 'Все', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: journalDto.userHasChangedDivisionTitles ? journalDto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Номер формы:', index: 'E7' },
        { value: journalDto?.formNumber?.join(', ') || 'Все', index: 'F7' },
        { value: 'Надзирающая прокуратура:', index: 'B8' },
        { value: transformAuthorities(journalDto.procuracyTitles)?.join(', ') || 'Все', index: 'C8' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'ИКУД', key: 'ikud' },
          { title: 'Уникальный номер (ИКУД, УНП, УНЛ)', key: 'uniqueNumber' },
          { title: 'Номер формы', key: 'formNumber' },
          { title: 'Идентификатор карточки', key: 'cardId' },
          { title: 'Источник', key: 'sourceTitle' },
          { title: 'Дата создания версии статистической карточки*', key: 'versionDate' },
          { title: 'Дата операции*', key: 'operationDate' },
          { title: 'Вид операции', key: 'operationTypeTitle' },
          { title: 'Пользователь', key: 'userLogin' },
          { title: 'Комментарий', key: 'comment' },
        ],
        11,
      )
      .fill(
        data.map((d, idx) => ({
          ...d,
          number: idx + 1,
          versionDate: getClientDateAndTime(journalDto.timeZone, d.versionDate),
          operationDate: getClientDateAndTime(journalDto.timeZone, d.operationDate),
        })),
        12,
      );
  }
}
