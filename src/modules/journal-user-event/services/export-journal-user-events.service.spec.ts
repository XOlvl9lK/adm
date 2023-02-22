import { TestHelpers } from '@common/test/testHelpers';
import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';
import { userEventsMock } from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
// eslint-disable-next-line max-len
import { ExportJournalUserEventsService } from '@modules/journal-user-event/services/export-journal-user-events.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { findUserEventsMockProvider } from '@modules/journal-user-event/controllers/journal-user-events.controller.spec';
import { ExportUserEventDto } from '@modules/journal-user-event/controllers/dtos/export-user-event.dto';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';

const helpers = new TestHelpers().getHelpers();

const exportUserEventsDtoMock = {
  page: 1,
  pageSize: 20,
  userLogin: 'Mcgowan',
  ipAddress: '177.154.72.233',
  browserVersion: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  result: [UserEventResultTypeEnum.SUCCESS],
  columnKeys: ['userLogin', 'eventDate', 'url'],
  timeZone: '180',
  viewer: 'PROK_GP',
  userHasChangedDivisionTitles: false,
} as ExportUserEventDto;

const exportUserEventsDataMock = [{ ...userEventsMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:J1')
  .subTitle('Журнал действий пользователей', 'B2:J2')
  .applyColumnOrdering(exportUserEventsDtoMock.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'regionTitle', width: 20 },
    { key: 'departmentTitle', width: 20 },
    { key: 'divisionTitle', width: 20 },
    { key: 'userLogin', width: 25 },
    { key: 'url', width: 25 },
    { key: 'browserVersion', width: 25 },
    { key: 'eventDate', width: 25 },
    { key: 'ipAddress', width: 20 },
    { key: 'resultTitle', width: 25 },
    { key: 'queryParam', width: 25 },
  ])
  .cells([
    { value: 'Период:', index: 'B4' },
    {
      value: getRangeDateString(exportUserEventsDtoMock.eventDate?.[0], exportUserEventsDtoMock.eventDate?.[1]),
      index: 'C4',
    },
    { value: 'Имя пользователя:', index: 'E4' },
    { value: exportUserEventsDtoMock?.userLogin || 'Не указано', index: 'F4' },
    { value: 'Дата формирования выгрузки:', index: 'J4' },
    {
      value: formatDate(
        applyTimezoneToDate(new Date().toISOString(), getUserTimezone(exportUserEventsDtoMock.timeZone || '0')),
        'dd.MM.yyyy HH:mm:ss',
      ),
      index: 'K4',
    },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportUserEventsDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Версия браузера:', index: 'E5' },
    { value: exportUserEventsDtoMock?.browserVersion || 'Не указано', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'J5' },
    { value: exportUserEventsDtoMock.viewer || 'Не указано', index: 'K5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportUserEventsDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'IP-адрес клиента:', index: 'E6' },
    { value: exportUserEventsDtoMock?.ipAddress || 'Не указано', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    {
      value: exportUserEventsDtoMock.userHasChangedDivisionTitles
        ? exportUserEventsDtoMock.divisionTitles?.join(', ')
        : 'Все',
      index: 'C7',
    },
    { value: `Результат обработки:`, index: 'E7' },
    { value: exportUserEventsDtoMock.result?.join(', ') || 'Все', index: 'F7' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'Регион', key: 'regionTitle' },
      { title: 'Ведомство', key: 'departmentTitle' },
      { title: 'Подразделение', key: 'divisionTitle' },
      { title: 'Имя пользователя', key: 'userLogin' },
      { title: 'URL', key: 'url' },
      { title: 'Версия браузера', key: 'browserVersion' },
      { title: 'Дата и время события', key: 'eventDate' },
      { title: 'IP адрес клиента', key: 'ipAddress' },
      { title: 'Результат обработки', key: 'resultTitle' },
      { title: 'Параметры запроса', key: 'queryParam' },
    ],
    9,
  )
  .fill(
    exportUserEventsDataMock.map((data, idx) => ({
      ...data,
      number: idx + 1,
      eventDate: getClientDateAndTime(exportUserEventsDtoMock.timeZone, data.eventDate),
    })),
    10,
  );

describe('ExportJournalUserEventsService', () => {
  let exportJournalUserEventsService: ExportJournalUserEventsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportJournalUserEventsService, findUserEventsMockProvider, helpers.archiverProvider],
    }).compile();

    exportJournalUserEventsService = moduleRef.get<ExportJournalUserEventsService>(ExportJournalUserEventsService);
  });

  test('Service should be defined', () => {
    expect(exportJournalUserEventsService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportJournalUserEventsService['createExcel'](exportUserEventsDtoMock, exportUserEventsDataMock);
    expect(excel).toEqual(mockExcel);
  });
});
