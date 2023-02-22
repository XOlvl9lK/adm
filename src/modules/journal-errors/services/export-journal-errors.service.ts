import { Injectable } from '@nestjs/common';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { ExportJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/export-journal-errors.dto';
import { Response } from 'express';
import { JournalErrorsEntity } from '@modules/journal-errors/domain/journal-errors.entity';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { XmlHelper } from '@modules/xml/infrastructure/xml.helper';
import { ExcelServiceBase } from '@common/base/excel-service.base';
import { formatDate, getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { WorkerService } from '@modules/worker/services/worker.service';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { getExportJobTitle } from '@modules/export-job/infrastructure/get-export-job-title';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { getExportJobLink } from '@modules/export-job/infrastructure/get-export-job-link';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class ExportJournalErrorsService extends ExcelServiceBase {
  constructor(
    private findJournalErrorsService: FindJournalErrorsService,
    private archiverService: ArchiverService,
    private workerService: WorkerService,
    private createExportJobService: CreateExportJobService,
    private updateExportJobService: UpdateExportJobService,
  ) {
    super({
      xlsx: 'Журнал_регистрации_ошибок_{date}_{index}',
      xls: 'Журнал_регистрации_ошибок_{date}_{index}',
      ods: 'Журнал_регистрации_ошибок_{date}_{index}',
      native: 'Журнал регистрации ошибок',
    });
  }

  async exportXlsx(exportJournalErrorsDto: ExportJournalErrorsDto, response: Response, token?: string) {
    if (exportJournalErrorsDto.pageSize && exportJournalErrorsDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          exportJournalErrorsDto.timeZone,
          exportJournalErrorsDto.eventDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, exportJournalErrorsDto, 'xlsx', createdJob);
      this.workerService.run(
        'exportJournalErrorsWorker',
        {
          dto: exportJournalErrorsDto,
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

    const { data } = await this.getData(exportJournalErrorsDto);
    return await this.exportFile(this.createExcel, exportJournalErrorsDto, data, 'xlsx', response);
  }

  async exportXls(exportJournalErrorsDto: ExportJournalErrorsDto, response: Response, token?: string) {
    if (exportJournalErrorsDto.pageSize && exportJournalErrorsDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          exportJournalErrorsDto.timeZone,
          exportJournalErrorsDto.eventDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, exportJournalErrorsDto, 'xls', createdJob);
      this.workerService.run(
        'exportJournalErrorsWorker',
        {
          dto: exportJournalErrorsDto,
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

    const { data } = await this.getData(exportJournalErrorsDto);
    return await this.exportFile(this.createExcel, exportJournalErrorsDto, data, 'xls', response);
  }

  async exportOds(exportJournalErrorsDto: ExportJournalErrorsDto, response: Response, token?: string) {
    if (exportJournalErrorsDto.pageSize && exportJournalErrorsDto.pageSize >= 1000) {
      const createdJob = await this.createExportJobService.create(
        token,
        getExportJobTitle(
          this.filenamePattern.native,
          exportJournalErrorsDto.timeZone,
          exportJournalErrorsDto.eventDate,
        ),
      );
      await this.createTemporaryFile(this.createExcel, exportJournalErrorsDto, 'ods', createdJob);
      this.workerService.run(
        'exportJournalErrorsWorker',
        {
          dto: exportJournalErrorsDto,
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

    const { data } = await this.getData(exportJournalErrorsDto);
    return await this.exportFile(this.createExcel, exportJournalErrorsDto, data, 'ods', response);
  }

  async exportXml(dto: ExportJournalErrorsDto, response: Response) {
    const { data } = await this.getData(dto);

    const dataStringXml = new XmlHelper('ArrayOfErrorLogRecord')
      .append('Total', data.length)
      .append(
        'ErrorLogRecord',
        data.map((d, idx) => ({
          id: d.id,
          error_date: getClientDateAndTime(dto.timeZone, d.eventDate),
          regionId: d.regionId,
          region: d.regionTitle,
          agency: d.departmentTitle,
          subdivision: d.divisionTitle,
          portal_section_name: d.siteSectionTitle,
          user_name: d.userLogin,
          ip: d.ipAddress,
          error_type: d.errorTypeTitle,
          error_description: d.errorDescription,
          rn: idx + 1,
        })),
      )
      .end();

    const filtersStringXml = new XmlHelper('FilteringExportModel')
      .append('default', [
        {
          FromDate: dto.eventDate?.[0] ? formatDate(dto.eventDate?.[0], "dd-MM-yyyy'T'HH:mm:ss") : '',
          ToDate: dto.eventDate?.[1] ? formatDate(dto.eventDate?.[1], "dd-MM-yyyy'T'HH:mm:ss") : '',
          Ip: dto?.ipAddress || 'Все',
          UserLogin: dto?.userLogin || 'Все',
          PortalSection: dto?.siteSectionTitle?.join('; ') || 'Все',
          LowAgency: transformAuthorities(dto?.departmentTitles)?.join(', ') || 'Все',
          Region: dto?.regionTitles?.join(', ') || 'Все',
          Subdivision: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все',
          ErrorType: dto?.errorTypeTitle?.join(', ') || 'Все',
        },
      ])
      .end();

    const archive = await this.archiverService.zip(
      { source: Buffer.from(dataStringXml), fileName: 'logs.xml' },
      { source: Buffer.from(filtersStringXml), fileName: 'filters.xml' },
    );
    this.writeContentHeader(response, this.generateFilename('native'));
    archive.pipe(response);
  }

  private async getData(dto: ExportJournalErrorsDto) {
    if (dto.ids?.length) {
      return await this.findJournalErrorsService.findByIds(dto.ids, dto.sort);
    }
    return await this.findJournalErrorsService.findAll(dto);
  }

  private createExcel(dto: ExportJournalErrorsDto, data: Array<JournalErrorsEntity & { id: string }>) {
    return new ExcelHelper()
      .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:J1')
      .subTitle('Журнал регистрации ошибок', 'A2:J2')
      .subTitle(
        // eslint-disable-next-line max-len
        '*Значение даты и времени отображается согласно часовому поясу подразделения текущего пользователя. В скобках выводится разница в часах между часовыми поясами совершения события и подразделения текущего пользователя',
        'A8:K8',
        false,
      )
      .applyColumnOrdering(dto.columnKeys)
      .columns([
        { key: 'number', width: 20 },
        { key: 'regionTitle', width: 20 },
        { key: 'departmentTitle', width: 20 },
        { key: 'divisionTitle', width: 20 },
        { key: 'siteSectionTitle', width: 30 },
        { key: 'userLogin', width: 25 },
        { key: 'eventDate', width: 25 },
        { key: 'ipAddress', width: 20 },
        { key: 'errorTypeTitle', width: 20 },
        { key: 'errorDescription', width: 150 },
      ])
      .cells([
        { value: 'Дата и время ошибки:', index: 'B4' },
        { value: getRangeDateString(dto.eventDate?.[0], dto.eventDate?.[1], dto.timeZone), index: 'C4' },
        { value: 'Компонент / раздел ГАС ПС:', index: 'E4' },
        { value: dto.siteSectionTitle?.join(', ') || 'Все', index: 'F4' },
        { value: 'Дата формирования выгрузки', index: 'I4' },
        { value: getClientDateAndTime(dto.timeZone, new Date().toISOString()), index: 'J4' },
        { value: 'Ведомство:', index: 'B5' },
        { value: transformAuthorities(dto.departmentTitles)?.join(', ') || 'Все', index: 'C5' },
        { value: 'Тип ошибки:', index: 'E5' },
        { value: dto.errorTypeTitle?.join(', ') || 'Все', index: 'F5' },
        { value: 'Пользователь, сформировавший выгрузку', index: 'I5' },
        { value: dto.viewer || 'Не указано', index: 'J5' },
        { value: 'Регион:', index: 'B6' },
        { value: dto.regionTitles?.join(', ') || 'Все', index: 'C6' },
        { value: 'Имя пользователь:', index: 'E6' },
        { value: dto.userLogin || 'Не указано', index: 'F6' },
        { value: 'Подразделение:', index: 'B7' },
        { value: dto.userHasChangedDivisionTitles ? dto.divisionTitles?.join(', ') : 'Все', index: 'C7' },
        { value: 'IP адрес клиента:', index: 'E7' },
        { value: dto.ipAddress || 'Не указано', index: 'F7' },
      ])
      .header(
        [
          { title: '№ п/п', key: 'number' },
          { title: 'Регион', key: 'regionTitle' },
          { title: 'Ведомство', key: 'departmentTitle' },
          { title: 'Подразделение', key: 'divisionTitle' },
          { title: 'Компонент/раздел ГАС ПС', key: 'siteSectionTitle' },
          { title: 'Имя пользователя', key: 'userLogin' },
          { title: 'Дата ошибки*', key: 'eventDate' },
          { title: 'IP адрес клиента', key: 'ipAddress' },
          { title: 'Тип ошибки', key: 'errorTypeTitle' },
          { title: 'Описание ошибки', key: 'errorDescription' },
        ],
        10,
      )
      .fill(
        data.map((d, idx) => ({
          ...d,
          number: idx + 1,
          eventDate: getClientDateAndTime(dto.timeZone, d.eventDate),
        })),
        11,
      );
  }
}
