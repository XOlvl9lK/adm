import { Injectable } from '@nestjs/common';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';
import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { User } from '@common/auth/infrastructure/user.interface';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { JournalKuspEntity } from '../domain/journal-kusp.entity';
import { StatusEnum } from '../domain/status.enum';

export interface ExportErrorInfo {
  id: string;
  user: User;
  timeZone?: string;
  format: 'xlsx' | 'xls' | 'ods';
}

@Injectable()
export class ExportErrorInfoService extends ExcelServiceBase {
  constructor(private journalKuspElasticRepo: JournalKuspElasticRepo) {
    super({
      xlsx: 'Журнал_обработки_КУСП_информация_об_ошибке_{date}',
      xls: 'Журнал_обработки_КУСП_информация_об_ошибке_{date}',
      ods: 'Журнал_обработки_КУСП_информация_об_ошибке_{date}',
      native: 'Журнал_обработки_КУСП_информация_об_ошибке_{date}',
    });
  }

  async exportErrorInfo(dto: ExportErrorInfo, response: Response) {
    const kusp = await this.journalKuspElasticRepo.findById(dto.id);
    return await this.exportFile(this.getErrorInfo, dto, kusp._source, dto.format, response);
  }

  getErrorInfo(dto: ExportErrorInfo, data: JournalKuspEntity) {
    const kuspNumberRequired = data.statusTitle === StatusEnum.FLK_ERRORS;
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:F1')
      .subTitle('Информация об ошибке', 'A2:F2')
      .cells([
        { value: 'Регион:', index: 'B4' },
        { value: data.regionTitle, index: 'C4' },
        { value: 'Имя файла:', index: 'B5' },
        { value: data.fileTitle, index: 'C5' },
        { value: 'Идентификатор:', index: 'B6' },
        { value: data.packageKuspId, index: 'C6' },
        { value: 'Статус:', index: 'B7' },
        { value: data.statusTitle, index: 'C7' },
        { value: 'Время начала обработки:', index: 'B8' },
        { value: getClientDateAndTime(dto.timeZone || '0', data.startProcessingDate), index: 'C8' },
        { value: 'Время окончания обработки:', index: 'B9' },
        { value: getClientDateAndTime(dto.timeZone || '0', data.endProcessingDate), index: 'C9' },
        { value: 'Оператор:', index: 'B10' },
        { value: data.operatorLogin, index: 'C10' },
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
        ...(kuspNumberRequired ? [{ key: 'number', width: 40 }] : []),
        { key: 'errorText', width: 40 },
        { key: '_', width: 15 },
        { key: '__', width: 40 },
        { key: '___', width: 40 },
      ])
      .header(['№ п/п', ...(kuspNumberRequired ? ['Номер КУСП'] : []), 'Текст ошибки'], 12)
      .fill(
        data.kuspNumber.map((k, idx) => ({
          ...k,
          id: idx + 1,
        })),
        13,
      );
  }
}
