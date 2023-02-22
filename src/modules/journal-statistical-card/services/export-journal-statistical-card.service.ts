import { Injectable } from '@nestjs/common';
import { ExcelServiceBase } from '@common/base/excel-service.base';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
import { Response } from 'express';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/export-journal-statistical-card.dto';
import { JournalStatisticalCardEntity } from '@modules/journal-statistical-card/domain/journal-statistical-card.entity';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
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
export class ExportJournalStatisticalCardService extends ExcelServiceBase {
  constructor(
    private findJournalStatisticalCardService: FindJournalStatisticalCardService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_обработки_стат_карточек_{date}_{index}',
      xls: 'Журнал_обработки_стат_карточек_{date}_{index}',
      ods: 'Журнал_обработки_стат_карточек_{date}_{index}',
      native: 'Журнал обработки статистических карточек',
    });
  }

  async exportXlsx(journalDto: ExportJournalStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalStatisticalCardWorker',
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

  async exportXls(journalDto: ExportJournalStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalStatisticalCardWorker',
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

  async exportOds(journalDto: ExportJournalStatisticalCardDto, response: Response, token?: string) {
    if (journalDto.pageSize && journalDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, journalDto.timeZone, journalDto.startProcessingDate),
      );
      await this.createTemporaryFile(this.createExcel, journalDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalStatisticalCardWorker',
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

  private async getData(dto: ExportJournalStatisticalCardDto) {
    if (dto.ids?.length) {
      return (await this.findJournalStatisticalCardService.findByIds(dto.ids, dto.sort)).data;
    }
    return (await this.findJournalStatisticalCardService.findAll(dto)).data;
  }

  private createExcel(
    dto: ExportJournalStatisticalCardDto,
    data: Array<JournalStatisticalCardEntity & { id: string }>,
  ) {
    let isProsecutorChangeString = 'Не указано';
    if (dto.isProsecutorChange) {
      if (dto.isProsecutorChange.length === 1) {
        if (dto.isProsecutorChange.includes(true)) {
          isProsecutorChangeString = 'Внесены';
        } else if (dto.isProsecutorChange.includes(false)) {
          isProsecutorChangeString = 'Не внесены';
        }
      } else {
        isProsecutorChangeString = 'Все';
      }
    }
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:M1')
      .subTitle('Журнал обработки статистических карточек', 'A2:M2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A11:K11',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'ikud', width: 20 },
        { key: 'divisionTitle', width: 20 },
        { key: 'regionTitle', width: 20 },
        { key: 'procuracyTitle', width: 30 },
        { key: 'formNumber', width: 20 },
        { key: 'cardId', width: 25 },
        { key: 'sourceTitle', width: 20 },
        { key: 'startProcessingDate', width: 30 },
        { key: 'endProcessingDate', width: 30 },
        { key: 'operatorLogin', width: 20 },
        { key: 'signer', width: 25 },
        { key: 'status', width: 25 },
        { key: 'isProsecutorChange', width: 25 },
      ])
      .cells([
        { value: 'Дата и время загрузки:', index: 'B4' },
        {
          value: getRangeDateString(dto.startProcessingDate?.[0], dto.startProcessingDate?.[1], dto.timeZone),
          index: 'C4',
        },
        { value: 'Статус:', index: 'E4' },
        { value: dto.statusTitle?.join(', ') || 'Все', index: 'F4' },
        { value: 'Дата формирования выгрузки:', index: 'L4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'M4',
        },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Идентификатор карточки:', index: 'E5' },
        { value: dto.cardId || 'Не указано', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'L5' },
        { value: dto.viewer || 'Не указано', index: 'M5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Вид карты:', index: 'E6' },
        { value: dto.cardType?.join(', ') || 'Все', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Источник:', index: 'E7' },
        { value: dto.sourceTitle?.join(', ') || 'Все', index: 'F7' },
        { value: 'Надзирающая прокуратура:', index: 'B8' },
        { value: transformAuthorities(dto.procuracyTitles)?.join(', ') || 'Все', index: 'C8' },
        { value: 'Номер формы:', index: 'E8' },
        { value: dto.formNumber?.join(', ') || 'Все', index: 'F8' },
        { value: 'Дата и время выставления статуса:', index: 'B9' },
        { value: getRangeDateString(dto.statusDate?.[0], dto.statusDate?.[1]), index: 'C9' },
        { value: 'Оператор:', index: 'E9' },
        { value: dto.operatorLogin || 'Не указано', index: 'F9' },
        { value: 'ИКУД:', index: 'B10' },
        { value: dto.ikud || 'Не указано', index: 'C10' },
        { value: 'Внесены изменения прокурором', index: 'E10' },
        { value: isProsecutorChangeString, index: 'F10' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'ИКУД', key: 'ikud' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Регион', key: 'regionTitle' },
          { title: 'Надзирающая прокуратура', key: 'procuracyTitle' },
          { title: 'Номер формы', key: 'formNumber' },
          { title: 'Идентификатор карточки', key: 'cardId' },
          { title: 'Источник', key: 'sourceTitle' },
          { title: 'Время начала обработки*', key: 'startProcessingDate' },
          { title: 'Время окончания обработки*', key: 'endProcessingDate' },
          { title: 'Оператор', key: 'operatorLogin' },
          { title: 'Подписанты', key: 'signer' },
          { title: 'Статус', key: 'status' },
          { title: 'Внесены изменения прокурором', key: 'isProsecutorChange' },
        ],
        13,
      )
      .fill(
        data.map((d, idx) => ({
          ...d,
          number: idx + 1,
          startProcessingDate: getClientDateAndTime(dto.timeZone, d.startProcessingDate),
          endProcessingDate: getClientDateAndTime(dto.timeZone, d.endProcessingDate),
          signer: d.signer
            ?.slice(0, 3)
            .map((s) => `${`${s.role}:` || ''} ${s.fullName || ''} ${s.position || ''} ${s.divisionTitle || ''}`)
            .join('\n'),
          status: d.status?.map((s) => s.title).pop() || '',
          isProsecutorChange: d?.isProsecutorChange ? 'Внесены' : 'Не внесены',
        })),
        14,
      );
  }
}
