import { TestHelpers } from '@common/test/testHelpers';
import { ProcessingResultEnum } from '@modules/journal-loading-unloading/domain/processing-result.enum';
// eslint-disable-next-line max-len
import { journalLoadingUnloadingMock } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/export-journal-loading-unloading.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { findJournalLoadingUnloadingServiceMockProvider } from '@modules/journal-loading-unloading/controllers/journal-loading-unloading.controller.spec';
import { formatDate, getClientDateAndTime, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/export-journal-loading-unloading.dto';

const helpers = new TestHelpers().getHelpers();

export const exportJournalLoadingUnloadingDtoMock = {
  page: 1,
  pageSize: 10,
  fileTitle: 'elit aute',
  processingResult: [ProcessingResultEnum.ERRORS_PRESENT],
  columnKeys: ['fileTitle', 'processingResultTitle'],
  importDate: ['2021-11-11T03:06:30-04:00', '2021-11-11T03:06:30-04:00'] as [string, string],
  exportDate: ['2021-11-11T03:06:30-04:00', '2021-11-11T03:06:30-04:00'] as [string, string],
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportJournalLoadingUnloadingDto;

const exportJournalLoadingUnloadingDataMock = [{ ...journalLoadingUnloadingMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:G1')
  .subTitle('Журнал выгрузки и загрузки', 'B2:G2')
  .applyColumnOrdering(exportJournalLoadingUnloadingDtoMock.columnKeys)
  .columns([
    { key: 'number' },
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
    {
      value: getRangeDateString(
        exportJournalLoadingUnloadingDtoMock.exportDate?.[0],
        exportJournalLoadingUnloadingDtoMock.exportDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Наименование файла:', index: 'E4' },
    { value: exportJournalLoadingUnloadingDtoMock.fileTitle || 'Не указано', index: 'F4' },
    { value: 'Дата формирования выгрузки:', index: 'H4' },
    // {
    //   value: formatDate(
    //     applyTimezoneToDate(
    //       new Date().toISOString(),
    //       getUserTimezone(exportJournalLoadingUnloadingDtoMock.timeZone || '0'),
    //     ),
    //     'dd.MM.yyyy HH:mm:ss',
    //   ),
    //   index: 'I4',
    // },
    { value: 'Дата и время загрузки:', index: 'B5' },
    {
      value: getRangeDateString(
        exportJournalLoadingUnloadingDtoMock.importDate?.[0],
        exportJournalLoadingUnloadingDtoMock.importDate?.[1],
      ),
      index: 'C5',
    },
    { value: 'Результат обработки:', index: 'E5' },
    { value: exportJournalLoadingUnloadingDtoMock.processingResult?.join(', ') || 'Все', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
    { value: exportJournalLoadingUnloadingDtoMock.viewer || 'Не указано', index: 'I5' },
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
    7,
  )
  .fill(
    exportJournalLoadingUnloadingDataMock.map((d, idx) => ({
      ...d,
      number: idx + 1,
      importDate: getClientDateAndTime(exportJournalLoadingUnloadingDtoMock.timeZone, d.importDate),
      exportDate: getClientDateAndTime(exportJournalLoadingUnloadingDtoMock.timeZone, d.exportDate),
    })),
    8,
  );

describe('ExportJournalLoadingUnloadingService', () => {
  let exportJournalLoadingUnloadingService: ExportJournalLoadingUnloadingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportJournalLoadingUnloadingService,
        findJournalLoadingUnloadingServiceMockProvider,
        helpers.archiverProvider,
      ],
    }).compile();

    exportJournalLoadingUnloadingService = moduleRef.get<ExportJournalLoadingUnloadingService>(
      ExportJournalLoadingUnloadingService,
    );
  });

  test('Service should be defined', () => {
    expect(exportJournalLoadingUnloadingService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportJournalLoadingUnloadingService['createExcel'](
      exportJournalLoadingUnloadingDtoMock,
      exportJournalLoadingUnloadingDataMock,
    );

    expect(excel).toEqual(mockExcel);
  });
});
