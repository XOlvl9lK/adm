import { Injectable } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
import { ExportStatusHistoryDto } from '@modules/journal-statistical-card/controllers/dtos/export-status-history.dto';
import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { orderBy } from 'lodash';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { JournalStatisticalCardEntity } from '../domain/journal-statistical-card.entity';
import { SortQuery } from '@common/utils/types';
import { User } from '@common/auth/infrastructure/user.interface';

interface ExportStatusHistory {
  id: string;
  timeZone?: string;
  sort?: SortQuery;
  format: 'xlsx' | 'xls' | 'ods';
  user: User;
}

@Injectable()
export class ExportStatusHistoryService extends ExcelServiceBase {
  constructor(private journalStatisticalCardElasticRepo: JournalStatisticalCardElasticRepo) {
    super({
      xlsx: 'Журнал_обработки_стат_карточек_история_статусов_{date}',
      xls: 'Журнал_обработки_стат_карточек_история_статусов_{date}',
      ods: 'Журнал_обработки_стат_карточек_история_статусов_{date}',
      native: 'Журнал_обработки_стат_карточек_история_статусов_{date}',
    });
  }

  async exportStatusHistory(dto: ExportStatusHistory, response: Response) {
    const data = await this.journalStatisticalCardElasticRepo.findById(dto.id);
    return await this.exportFile(this.getStatusHistory, dto, data._source, dto.format, response);
  }

  getStatusHistory(dto: ExportStatusHistory, data: JournalStatisticalCardEntity) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:F1')
      .subTitle('История статусов', 'A2:F2')
      .cells([
        { value: 'Идентификатор:', index: 'B4' },
        { value: data.cardId, index: 'C4' },
        { value: 'ИКУД:', index: 'B5' },
        { value: data.ikud, index: 'C5' },
        { value: 'Номер формы:', index: 'B6' },
        { value: data.formNumber, index: 'C6' },
        { value: 'Дата и время начала обработки:', index: 'B7' },
        { value: getClientDateAndTime(dto.timeZone || '0', data.startProcessingDate), index: 'C7' },
        { value: 'Дата и время окончания обработки:', index: 'B8' },
        { value: getClientDateAndTime(dto.timeZone || '0', data.endProcessingDate), index: 'C8' },
        { value: 'Дата формирования выгрузки:', index: 'E4' },
        {
          value: formatDate(
            applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
            'dd.MM.yyyy HH:mm:ss',
          ),
          index: 'F4',
        },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'E5' },
        { value: dto.user.username, index: 'F5' },
      ])
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A9:K9',
        false,
      )
      .columns([
        { key: 'id', width: 20 },
        { key: 'status', width: 40 },
        { key: 'date', width: 40 },
        { key: '_', width: 15 },
        { key: '__', width: 40 },
        { key: '___', width: 40 },
      ])
      .header(
        [
          { title: '№ п/п', key: 'id' },
          { title: 'Статус', key: 'status' },
          { title: 'Дата*', key: 'date' },
        ],
        11,
      )
      .fill(
        orderBy(
          data.status,
          Object.keys(dto.sort),
          Object.values(dto.sort).map((direction) => direction.toLocaleLowerCase() as 'asc' | 'desc'),
        ).map((status, idx) => ({
          id: idx + 1,
          status: status.title,
          date: getClientDateAndTime(dto.timeZone, status.date),
        })),
        12,
      );
  }
}
