import { TestHelpers } from '@common/test/testHelpers';
import { ExportSmevHistoryService } from '@modules/smev-history/services/export-smev-history.service';
import { Test } from '@nestjs/testing';
import { mockSmevHistoryInstance } from '@modules/smev-history/services/find-smev-history.service.spec';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { SmevHistoryStateEnum } from '@modules/smev-history/domain/smev-history-state.enum';
import { ExportSmevHistoryDto } from '@modules/smev-history/controllers/dtos/export-smev-history.dto';

const helpers = new TestHelpers().getHelpers();

const mockExportSmevHistoryDto = {
  page: 1,
  pageSize: 10,
  state: [SmevHistoryStateEnum.ACK],
  timeZone: '180',
  viewer: 'PROK_GP',
  columnKeys: ['state'],
} as ExportSmevHistoryDto;

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:M1')
  .subTitle('Журнал действий пользователей', 'A2:M2')
  .applyColumnOrdering(mockExportSmevHistoryDto.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'createDate', width: 20 },
    { key: 'updateDate', width: 20 },
    { key: 'departmentName', width: 20 },
    { key: 'smevAuthorityCertificate', width: 20 },
    { key: 'methodName', width: 20 },
    { key: 'state', width: 20 },
    { key: 'getTaskRequest', width: 20 },
    { key: 'getTaskResponse', width: 20 },
    { key: 'ackRequest', width: 20 },
    { key: 'ackResponse', width: 20 },
    { key: 'sendTaskRequest', width: 20 },
    { key: 'sendTaskResponse', width: 20 },
  ])
  .cells([
    { value: 'Период:', index: 'B4' },
    {
      value: getRangeDateString(mockExportSmevHistoryDto.createDate?.[0], mockExportSmevHistoryDto.createDate?.[1]),
      index: 'C4',
    },
    { value: 'Дата формирования выгрузки:', index: 'L4' },
    {
      value: formatDate(
        applyTimezoneToDate(new Date().toISOString(), getUserTimezone(mockExportSmevHistoryDto.timeZone || '0')),
        'dd.MM.yyyy HH:mm:ss',
      ),
      index: 'M4',
    },
    { value: 'Наименование внешнего ОВ:', index: 'B5' },
    { value: mockExportSmevHistoryDto.departmentName?.join(', ') || 'Все', index: 'C5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'L5' },
    { value: mockExportSmevHistoryDto.viewer || 'Не указано', index: 'M5' },
    { value: 'Статус запроса:', index: 'B6' },
    { value: mockExportSmevHistoryDto.state?.join(', ') || 'Все', index: 'C6' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'Дата и время начала', key: 'createDate' },
      { title: 'Дата и время окончания', key: 'updateDate' },
      { title: 'Наименование внешнего ОВ', key: 'departmentName' },
      { title: 'Сертификат ЭП ОВ', key: 'smevAuthorityCertificate' },
      { title: 'Тип запроса', key: 'methodName' },
      { title: 'Статус запроса', key: 'state' },
      { title: 'Получение задачи. XML запроса', key: 'getTaskRequest' },
      { title: 'Получение задачи. XML ответа', key: 'getTaskResponse' },
      { title: 'Подтверждение получения задачи. XML запроса', key: 'ackRequest' },
      { title: 'Подтверждение получения задачи. XML ответа', key: 'ackResponse' },
      { title: 'Решение задачи. XML запроса', key: 'sendTaskRequest' },
      { title: 'Решение задачи. XML ответа', key: 'sendTaskResponse' },
    ],
    9,
  )
  .fill(
    [mockSmevHistoryInstance].map((data, idx) => ({
      ...data,
      number: idx + 1,
      departmentName: mockSmevHistoryInstance.integration?.departmentName,
      createDate: getClientDateAndTime(mockExportSmevHistoryDto.timeZone, data.createDate),
      updateDate: getClientDateAndTime(mockExportSmevHistoryDto.timeZone, data.updateDate),
    })),
    10,
  );

describe('ExportSmevHistoryService', () => {
  let exportSmevHistoryService: ExportSmevHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportSmevHistoryService,
        {
          provide: FindSmevHistoryService,
          useValue: {
            findByIds: jest.fn().mockResolvedValue({ data: [mockSmevHistoryInstance], total: 1 }),
            findAll: jest.fn().mockResolvedValue({ data: [mockSmevHistoryInstance], total: 1 }),
          },
        },
        helpers.archiverProvider,
      ],
    }).compile();

    exportSmevHistoryService = moduleRef.get(ExportSmevHistoryService);
  });

  test('Should create correct excel object', async () => {
    const excel = exportSmevHistoryService['createExcel'](mockExportSmevHistoryDto, [mockSmevHistoryInstance]);

    expect(excel).toEqual(mockExcel);
  });

  test('File size should be grater than 0 on exportXlsx', async () => {
    await exportSmevHistoryService.exportXlsx(mockExportSmevHistoryDto, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('File size should be grater than 0 on exportXls', async () => {
    await exportSmevHistoryService.exportXls(mockExportSmevHistoryDto, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('File size should be grater than 0 on exportOds', async () => {
    await exportSmevHistoryService.exportOds(mockExportSmevHistoryDto, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });
});
