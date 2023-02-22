import { TestHelpers } from '@common/test/testHelpers';
import { spvHistoryMock } from '@modules/spv-history/infrastructure/spv-history.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { ExportSpvHistory, ExportSpvHistoryService } from '@modules/spv-history/services/export-spv-history.service';
import { Test } from '@nestjs/testing';
import { findSpvHistoryMockProvider } from '@modules/spv-history/controllers/spv-history.controller.spec';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';

const helpers = new TestHelpers().getHelpers();

const dto = {
  page: 1,
  pageSize: 10,
  dateFrom: new Date('2022-06-30T21:39:29.971084'),
  dateTo: new Date('2022-06-30T21:39:29.971084'),
  columnKeys: ['requestNumber', 'requestState'],
  timeZone: '180',
} as ExportSpvHistory;

const exportSpvHistoryDataMock = [{ ...spvHistoryMock, id: helpers.random.id }];

const dateTime = `${new Date(dto.dateFrom).toLocaleString()} - ${new Date(dto.dateTo).toLocaleString()}`;

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
  .subTitle('Журнал СПВ', 'A2:I2')
  .applyColumnOrdering(dto.columnKeys)
  .columns([
    { key: 'number', width: 20 },
    { key: 'startDate', width: 20 },
    { key: 'finishDate', width: 20 },
    { key: 'integrationName', width: 20 },
    { key: 'uniqueSecurityKey', width: 25 },
    { key: 'requestMethod', width: 20 },
    { key: 'requestState', width: 20 },
    { key: 'requestXmlUrl', width: 20 },
    { key: 'responseXmlUrl', width: 20 },
  ])
  .cells([
    {
      value: 'ОВ',
      index: 'B4',
    },
    {
      value: dto.integrations ? dto.integrations.join(', ') : 'Все',
      index: 'C4',
    },

    {
      value: 'Период',
      index: 'B5',
    },
    {
      value: dateTime,
      index: 'C5',
    },

    {
      value: 'Дата формирования выгрузки',
      index: 'H4',
    },
    {
      value: getClientDateAndTime(dto.timeZone, new Date().toISOString()),
      index: 'I4',
    },

    {
      value: 'Пользователь, сформировавший выгрузку',
      index: 'H5',
    },
    {
      value: 'PROK_GP',
      index: 'I5',
    },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'Дата и время начала', key: 'startDate' },
      { title: 'Дата и время окончания', key: 'finishDate' },
      { title: 'Наименование внешнего ОВ', key: 'integrationName' },
      { title: 'Ключ безопасности', key: 'uniqueSecurityKey' },
      { title: 'Тип запроса', key: 'requestMethod' },
      { title: 'Статус запроса', key: 'requestState' },
      { title: 'XML запроса', key: 'requestXmlUrl' },
      { title: 'XML ответа', key: 'responseXmlUrl' },
    ],
    7,
  )
  .fill(
    exportSpvHistoryDataMock.map((data, idx) => ({
      ...data,
      number: idx + 1,
      requestMethod: data.requestMethod?.name || '',
      startDate: data.startDate ? new Date(data.startDate).toLocaleString() : '',
      finishDate: data.finishDate ? new Date(data.finishDate).toLocaleString() : '',
    })),
    8,
  );

describe('ExportSpvHistoryService', () => {
  let exportSpvHistoryService: ExportSpvHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportSpvHistoryService, findSpvHistoryMockProvider, helpers.archiverProvider],
    }).compile();

    exportSpvHistoryService = moduleRef.get(ExportSpvHistoryService);
  });

  it('Service should be defined', () => {
    expect(exportSpvHistoryService).toBeDefined();
  });

  it('Should create correct excel object', () => {
    const excel = exportSpvHistoryService['createExcel'](dto, exportSpvHistoryDataMock);

    expect(excel).toEqual(mockExcel);
  });
});
