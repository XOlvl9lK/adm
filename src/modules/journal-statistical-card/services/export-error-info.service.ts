import { Injectable } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { orderBy } from 'lodash';
import { User } from '@common/auth/infrastructure/user.interface';
import { JournalStatisticalCardEntity } from '../domain/journal-statistical-card.entity';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { StatisticalCardStatusEnum } from '../domain/statistical-card-status.enum';

const { FLK_ERRORS, FOUND_FLK_ERRORS } = StatisticalCardStatusEnum;

export interface ExportErrorInfo {
  id: string;
  timeZone?: string;
  format: 'xlsx' | 'xls' | 'ods';
  user: User;
}

@Injectable()
export class ExportErrorInfoService extends ExcelServiceBase {
  constructor(private journalStatisticalCardElasticRepo: JournalStatisticalCardElasticRepo) {
    super({
      xlsx: 'Журнал_обработки_стат_карточек_информация_об_ошибке_{date}',
      xls: 'Журнал_обработки_стат_карточек_информация_об_ошибке_{date}',
      ods: 'Журнал_обработки_стат_карточек_информация_об_ошибке_{date}',
      native: 'Журнал_обработки_стат_карточек_информация_об_ошибке_{date}',
    });
  }

  async exportErrorInfo(dto: ExportErrorInfo, response: Response) {
    const data = await this.journalStatisticalCardElasticRepo.findById(dto.id);
    return await this.exportFile(this.getErrorInfo, dto, data._source, dto.format, response);
  }

  getErrorInfo(dto: ExportErrorInfo, data: JournalStatisticalCardEntity) {
    const requisiteRequired = [FLK_ERRORS, FOUND_FLK_ERRORS].includes(data.statusTitle);
    const statuses = orderBy(data.status, 'date').pop();
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:F1')
      .subTitle('Информация об ошибке', 'A2:F2')
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
      .columns([
        { key: 'id', width: 20 },
        ...(requisiteRequired ? [{ key: 'requisite', width: 40 }] : []),
        { key: 'text', width: 40 },
        { key: '_', width: 15 },
        { key: '__', width: 40 },
        { key: '___', width: 40 },
      ])
      .header(
        [
          { title: '№ п/п', key: 'id' },
          ...(requisiteRequired ? [{ title: 'Реквизит', key: 'requisite' }] : []),
          { title: 'Текст ошибки', key: 'text' },
        ],
        10,
      )
      .fill(
        (statuses.errorDescription || []).map((item, idx) => ({
          ...item,
          id: idx + 1,
        })),
        11,
      );
  }
}
