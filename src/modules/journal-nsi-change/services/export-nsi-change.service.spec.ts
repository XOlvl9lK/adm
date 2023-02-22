import { TestHelpers } from '@common/test/testHelpers';
import { NsiChangeActionEnum } from '@modules/journal-nsi-change/domain/nsi-change-action.enum';
import { NsiChangeObjectEnum } from '@modules/journal-nsi-change/domain/nsi-change-object.enum';
import { nsiChangeMock } from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { ExportNsiChangeService } from '@modules/journal-nsi-change/services/export-nsi-change.service';
import { Test } from '@nestjs/testing';
import { findNsiChangeServiceMockProvider } from '@modules/journal-nsi-change/controllers/nsi-change.controller.spec';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { ExportNsiChangeDto } from '@modules/journal-nsi-change/controllers/dto/export-nsi-change.dto';

const helpers = new TestHelpers().getHelpers();

const exportNsiChangeDtoMock = {
  page: 1,
  pageSize: 10,
  userName: 'Romero',
  ipAddress: '8.107.242.230',
  eventDate: ['2015-05-24T08:40:29-04:00', '2015-05-24T08:40:29-04:00'] as [string, string],
  eventTitle: [NsiChangeActionEnum.CREATE],
  objectTitle: [NsiChangeObjectEnum.CATALOGUE],
  columnKeys: ['userName', 'ipAddress'],
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportNsiChangeDto;

const exportNsiChangeDataMock = [{ ...nsiChangeMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
  .subTitle('Журнал изменений НСИ', 'A2:I2')
  .applyColumnOrdering(exportNsiChangeDtoMock.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'eventDate', width: 20 },
    { key: 'userName', width: 20 },
    { key: 'ipAddress', width: 20 },
    { key: 'sessionId', width: 25 },
    { key: 'objectTitle', width: 20 },
    { key: 'eventTitle', width: 20 },
  ])
  .columnWidth({
    H: 20,
    I: 20,
  })
  .cells([
    { value: 'Период:', index: 'B4' },
    {
      value: getRangeDateString(exportNsiChangeDtoMock.eventDate?.[0], exportNsiChangeDtoMock.eventDate?.[1]),
      index: 'C4',
    },
    { value: 'Объект:', index: 'E4' },
    { value: exportNsiChangeDtoMock.objectTitle?.join(', ') || 'Все', index: 'F4' },
    { value: 'Дата формирования выгрузки:', index: 'H4' },
    {
      value: formatDate(
        applyTimezoneToDate(new Date().toISOString(), getUserTimezone(exportNsiChangeDtoMock.timeZone || '0')),
        'dd.MM.yyyy HH:mm:ss',
      ),
      index: 'I4',
    },
    { value: 'ФИО пользователя:', index: 'B5' },
    { value: exportNsiChangeDtoMock.userName || 'Не указано', index: 'C5' },
    { value: 'Действие:', index: 'E5' },
    { value: exportNsiChangeDtoMock.eventTitle?.join(', ') || 'Все', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку', index: 'H5' },
    { value: exportNsiChangeDtoMock.viewer || 'Не указано', index: 'I5' },
    { value: 'IP адрес:', index: 'B6' },
    { value: exportNsiChangeDtoMock.ipAddress || 'Не указано', index: 'C6' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'Дата и время изменения', key: 'eventDate' },
      { title: 'ФИО пользователя', key: 'userName' },
      { title: 'IP-адрес', key: 'ipAddress' },
      { title: 'Идентификатор сессии', key: 'sessionId' },
      { title: 'Объект', key: 'objectTitle' },
      { title: 'Действие', key: 'eventTitle' },
    ],
    10,
  )
  .fill(
    exportNsiChangeDataMock.map((data, idx) => ({
      ...data,
      number: idx + 1,
      eventDate: getClientDateAndTime(exportNsiChangeDtoMock.timeZone, data.eventDate),
    })),
    11,
  );

describe('ExportNsiChangeService', () => {
  let exportNsiChangeService: ExportNsiChangeService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportNsiChangeService, findNsiChangeServiceMockProvider, helpers.archiverProvider],
    }).compile();

    exportNsiChangeService = moduleRef.get<ExportNsiChangeService>(ExportNsiChangeService);
  });

  test('Service should be defined', () => {
    expect(exportNsiChangeService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportNsiChangeService['createExcel'](exportNsiChangeDtoMock, exportNsiChangeDataMock);

    expect(excel).toEqual(mockExcel);
  });
});
