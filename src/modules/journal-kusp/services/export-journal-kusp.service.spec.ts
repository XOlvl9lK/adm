import { TestHelpers } from '@common/test/testHelpers';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';
import { journalKuspMock } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { StatusEnum } from '@modules/journal-kusp/domain/status.enum';
import { SourceEnum } from '@modules/journal-kusp/domain/source.enum';
import { ExportJournalKuspService } from '@modules/journal-kusp/services/export-journal-kusp.service';
import { Test } from '@nestjs/testing';
import { findJournalKuspServiceMockProvider } from '@modules/journal-kusp/controllers/journal-kusp.controller.spec';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { ExportJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/export-journal-kusp.dto';

const helpers = new TestHelpers().getHelpers();

export const exportJournalKuspDtoMock = {
  page: 1,
  pageSize: 10,
  fileTitle: 'consectetur sit',
  kuspNumber: '62b2e47cb2cc5ce3022beccb',
  signerName: 'Nell Turner',
  regionTitles: ['Регион 4'],
  packageTypes: [PackageTypeEnum.WITHOUT_SIGNATURE],
  statuses: [StatusEnum.SUCCESS],
  sources: [SourceEnum.SPV],
  columnKeys: ['fileTitle', 'regionTitle'],
  operatorLogin: 'Joann',
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportJournalKuspDto;

const exportJournalKuspDataMock = [{ ...journalKuspMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:N1')
  .subTitle('Журнал обработки КУСП', 'A2:N2')
  .applyColumnOrdering(exportJournalKuspDtoMock.columnKeys)
  .columns([
    { key: 'number' },
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
      value: getRangeDateString(
        exportJournalKuspDtoMock.startProcessingDate?.[0],
        exportJournalKuspDtoMock.startProcessingDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Статус:', index: 'E4' },
    { value: exportJournalKuspDtoMock.statuses?.join(', ') || 'Все', index: 'F4' },
    { value: 'Дата формирования выгрузки:', index: 'M4' },
    // {
    //   value: formatDate(
    //     applyTimezoneToDate(new Date().toISOString(), getUserTimezone(dto.timeZone || '0')),
    //     'dd.MM.yyyy HH:mm:ss',
    //   ),
    //   index: 'N4',
    // },
    { value: 'Ведомство, сформировавшее пакет КУСП', index: 'B5' },
    { value: exportJournalKuspDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Вид пакета:', index: 'E5' },
    { value: exportJournalKuspDtoMock.packageTypes?.join(', ') || 'Все', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'M5' },
    { value: exportJournalKuspDtoMock.viewer || 'Не указано', index: 'N5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportJournalKuspDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Источник:', index: 'E6' },
    { value: exportJournalKuspDtoMock.sources?.join(', ') || 'Все', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    {
      value: exportJournalKuspDtoMock.userHasChangedDivisionTitles
        ? exportJournalKuspDtoMock.divisionTitles?.join(', ')
        : 'Все',
      index: 'C7',
    },
    { value: 'Оператор:', index: 'E7' },
    { value: exportJournalKuspDtoMock.operatorLogin || 'Не указано', index: 'F7' },
    { value: 'Наименование пакета:', index: 'B8' },
    { value: exportJournalKuspDtoMock.fileTitle || 'Не указано', index: 'C8' },
    { value: 'Фамилия подписанта:', index: 'E8' },
    { value: exportJournalKuspDtoMock.signerName || 'Не указано', index: 'F8' },
    { value: 'Номер КУСП', index: 'B9' },
    { value: exportJournalKuspDtoMock.kuspNumber || 'Не указано', index: 'C9' },
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
      { title: 'Дата и время создания', key: 'createDate' },
      { title: 'Количество записей', key: 'allPackageRecordsNumber' },
      { title: 'Загружено', key: 'downloadedRecordsNumber' },
      { title: 'Обработано с ошибками', key: 'errorProcessedRecordsNumber' },
      { title: 'Источник', key: 'sourceTitle' },
      { title: 'Время начала обработки', key: 'startProcessingDate' },
      { title: 'Время окончания обработки', key: 'endProcessingDate' },
      { title: 'Подписанты', key: 'signer' },
      { title: 'Оператор', key: 'operatorLogin' },
      { title: 'Статус', key: 'statusTitle' },
    ],
    11,
  )
  .fill(
    exportJournalKuspDataMock.map((d, idx) => ({
      ...d,
      number: idx + 1,
      createDate: getClientDateAndTime(exportJournalKuspDtoMock.timeZone, d.createDate),
      startProcessingDate: getClientDateAndTime(exportJournalKuspDtoMock.timeZone, d.startProcessingDate),
      endProcessingDate: getClientDateAndTime(exportJournalKuspDtoMock.timeZone, d.endProcessingDate),
      signer: d.signer
        ?.map((s) => `${s.role}: ${s.fullName} ${s.position} ${s.divisionTitle}. Роль: ${s.role}`)
        .join('. '),
    })),
    12,
  );

describe('ExportJournalKuspService', () => {
  let exportJournalKuspService: ExportJournalKuspService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportJournalKuspService, findJournalKuspServiceMockProvider, helpers.archiverProvider],
    }).compile();

    exportJournalKuspService = moduleRef.get<ExportJournalKuspService>(ExportJournalKuspService);
  });

  test('Service should be defined', () => {
    expect(exportJournalKuspService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportJournalKuspService['createExcel'](exportJournalKuspDtoMock, exportJournalKuspDataMock);

    expect(excel).toEqual(mockExcel);
  });
});
