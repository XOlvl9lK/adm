import { Injectable } from '@nestjs/common';
import { FindTypicalViolationService } from './find-typical-violation.service';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { ExportTypicalViolationDto } from '../controllers/dtos/export-typical-violation.dto';
import { Response } from 'express';
import { TypicalViolationsEntity } from '../domain/typical-violations.entity';
import { ExcelHelper } from '../../excel/infrastructure/excel.helper';
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
export class ExportTypicalViolationService extends ExcelServiceBase {
  constructor(
    private findTypicalViolationService: FindTypicalViolationService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_изменений_типовых_нарушений_{date}_{index}',
      xls: 'Журнал_изменений_типовых_нарушений_{date}_{index}',
      ods: 'Журнал_изменений_типовых_нарушений_{date}_{index}',
      native: 'Журнал изменений типовых нарушений',
    });
  }

  async exportXlsx(dto: ExportTypicalViolationDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xlsx', createdJob);
      this.workerService.run(
        'exportTypicalViolationWorker',
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

  async exportXls(dto: ExportTypicalViolationDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'xls', createdJob);
      this.workerService.run(
        'exportTypicalViolationWorker',
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

  async exportOds(dto: ExportTypicalViolationDto, response: Response, token?: string) {
    if (dto.pageSize && dto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(this.filenamePattern.native, dto.timeZone, dto.operationDate),
      );
      await this.createTemporaryFile(this.createExcel, dto, 'ods', createdJob);
      this.workerService.run(
        'exportTypicalViolationWorker',
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

  private createExcel(dto: ExportTypicalViolationDto, data: Array<TypicalViolationsEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:K1')
      .subTitle('Журнал изменений типовых нарушений', 'A2:K2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A10:K10',
      )
      .applyColumnOrdering(dto.columnKeys)
      .cells([
        { value: 'Дата и время операции', index: 'B4' },
        { value: getRangeDateString(dto.operationDate?.[0], dto.operationDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Идентификатор карточки', index: 'E4' },
        { value: dto.cardId || 'Не указано', index: 'F4' },
        { value: 'Дата формирования выгрузки', index: 'J4' },
        { value: getClientDateAndTime(dto.timeZone, new Date().toISOString()), index: 'K4' },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Номер формы:', index: 'E5' },
        { value: dto.formNumber?.join(', ') || 'Все', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку:', index: 'J5' },
        { value: dto.viewer || 'Не указано', index: 'K5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Вид сущности:', index: 'E6' },
        { value: dto.entityTypeTitle?.join(', ') || 'Все', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'Наименование типовой проверки:', index: 'E7' },
        { value: dto.examinationTypeTitle?.join(', ') || 'Не указано', index: 'F7' },
        { value: 'Надзирающая прокуратура:', index: 'B8' },
        { value: transformAuthorities(dto.procuracyTitles)?.join(', ') || 'Все', index: 'C8' },
        { value: 'Вид действия:', index: 'E8' },
        { value: dto.operationTypeTitle?.join(', ') || 'Все', index: 'F8' },
        { value: 'Дата версии:', index: 'B9' },
        { value: getRangeDateString(dto.versionDate?.[0], dto.versionDate?.[1]), index: 'C9' },
        { value: 'Пользователь:', index: 'E9' },
        { value: dto.userName || 'Не указано', index: 'F9' },
      ])
      .columns([
        { key: 'number', width: 20 },
        { key: 'uniqueNumber', width: 20 },
        { key: 'cardId', width: 20 },
        { key: 'versionDate', width: 20 },
        { key: 'formNumber', width: 20 },
        { key: 'entityTypeTitle', width: 20 },
        { key: 'examinationTypeTitle', width: 20 },
        { key: 'operationTypeTitle', width: 20 },
        { key: 'operationDate', width: 20 },
        { key: 'comment', width: 20 },
        { key: 'userName', width: 20 },
      ])
      .header(
        [
          { title: '№ П/П', key: 'number' },
          { title: 'Уникальный номер (ИКУД, УНП, УНЛ)', key: 'uniqueNumber' },
          { title: 'Идентификатор', key: 'cardId' },
          { title: 'Дата версии*', key: 'versionDate' },
          { title: 'Номер формы', key: 'formNumber' },
          { title: 'Вид сущности', key: 'entityTypeTitle' },
          { title: 'Наименование типовой проверки', key: 'examinationTypeTitle' },
          { title: 'Вид действия', key: 'operationTypeTitle' },
          { title: 'Дата и время операции*', key: 'operationDate' },
          { title: 'Комментарий', key: 'comment' },
          { title: 'Пользователь', key: 'userName' },
        ],
        12,
      )
      .fill(
        data.map((data, id) => ({
          ...data,
          number: id + 1,
          versionDate: getClientDateAndTime(dto.timeZone, data.versionDate),
          operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
          userName: `${data.userName}\n${data.userPositionTitle}`,
        })),
        13,
      );
  }

  async getData(dto: ExportTypicalViolationDto) {
    const result = dto.ids?.length
      ? await this.findTypicalViolationService.findByIds(dto.ids, dto.sort)
      : await this.findTypicalViolationService.findAll(dto);
    return result.data;
  }
}
