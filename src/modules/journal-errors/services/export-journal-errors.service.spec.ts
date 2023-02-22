import { TestHelpers } from '@common/test/testHelpers';
import { ErrorTypeEnum } from '@modules/journal-errors/domain/error-type.enum';
import { journalErrorsMock } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { ExportJournalErrorsService } from '@modules/journal-errors/services/export-journal-errors.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { findJournalErrorsServiceMockProvider } from '@modules/journal-errors/controllers/journal-errors.controller.spec';
import { SiteSectionEnum } from '@modules/journal-errors/domain/site-section.enum';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { ExportJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/export-journal-errors.dto';

const helpers = new TestHelpers().getHelpers();

export const exportJournalErrorsDtoMock = {
  page: 1,
  pageSize: 10,
  ipAddress: '93.240.61.67',
  errorTypeTitle: [ErrorTypeEnum.USER],
  userLogin: 'Todd',
  divisionTitles: ['Подразделение 1'],
  regionTitles: ['Регион 1'],
  eventDate: ['2022-09-09T00:54:17.847-06:00', '2022-09-09T00:54:17.847-06:00'] as [string, string],
  columnKeys: ['userLogin', 'ipAddress'],
  siteSectionTitle: [SiteSectionEnum.REGISTERS_CRIMES],
  timeZone: '180',
  viewer: 'PROK_GP',
  userHasChangedDivisionTitles: true,
} as ExportJournalErrorsDto;

const exportJournalErrorsDataMock = [{ ...journalErrorsMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:J1')
  .subTitle('Журнал регистрации ошибок', 'A2:J2')
  .applyColumnOrdering(exportJournalErrorsDtoMock.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'regionTitle', width: 20 },
    { key: 'departmentTitle', width: 20 },
    { key: 'divisionTitle', width: 20 },
    { key: 'siteSectionTitle', width: 30 },
    { key: 'userLogin', width: 25 },
    { key: 'eventDate', width: 20 },
    { key: 'ipAddress', width: 20 },
    { key: 'errorTypeTitle', width: 20 },
    { key: 'errorDescription', width: 25 },
  ])
  .cells([
    { value: 'Дата и время ошибки:', index: 'B4' },
    {
      value: getRangeDateString(exportJournalErrorsDtoMock.eventDate?.[0], exportJournalErrorsDtoMock.eventDate?.[1]),
      index: 'C4',
    },
    { value: 'Компонент / раздел ГАС ПС:', index: 'E4' },
    { value: exportJournalErrorsDtoMock.siteSectionTitle?.join(', ') || 'Все', index: 'F4' },
    { value: 'Дата формирования выгрузки', index: 'I4' },
    { value: getClientDateAndTime(exportJournalErrorsDtoMock.timeZone, new Date().toISOString()), index: 'J4' },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportJournalErrorsDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Тип ошибки:', index: 'E5' },
    { value: exportJournalErrorsDtoMock.errorTypeTitle?.join(', ') || 'Все', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку', index: 'I5' },
    { value: exportJournalErrorsDtoMock.viewer || 'Не указано', index: 'J5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportJournalErrorsDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Имя пользователь:', index: 'E6' },
    { value: exportJournalErrorsDtoMock.userLogin || 'Не указано', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    {
      value: exportJournalErrorsDtoMock.userHasChangedDivisionTitles
        ? exportJournalErrorsDtoMock.divisionTitles?.join(', ')
        : 'Все',
      index: 'C7',
    },
    { value: 'IP адрес клиента:', index: 'E7' },
    { value: exportJournalErrorsDtoMock.ipAddress || 'Не указано', index: 'F7' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'Регион', key: 'regionTitle' },
      { title: 'Ведомство', key: 'departmentTitle' },
      { title: 'Подразделение', key: 'divisionTitle' },
      { title: 'Компонент/раздел ГАС ПС', key: 'siteSectionTitle' },
      { title: 'Имя пользователя', key: 'userLogin' },
      { title: 'Дата ошибки', key: 'eventDate' },
      { title: 'IP адрес клиента', key: 'ipAddress' },
      { title: 'Тип ошибки', key: 'errorTypeTitle' },
      { title: 'Описание ошибки', key: 'errorDescription' },
    ],
    9,
  )
  .fill(
    exportJournalErrorsDataMock.map((d, idx) => ({
      ...d,
      number: idx + 1,
      eventDate: getClientDateAndTime(exportJournalErrorsDtoMock.timeZone, d.eventDate),
    })),
    10,
  );

describe('ExportJournalErrorsService', () => {
  let exportJournalErrorsService: ExportJournalErrorsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportJournalErrorsService, findJournalErrorsServiceMockProvider, helpers.archiverProvider],
    }).compile();

    exportJournalErrorsService = moduleRef.get<ExportJournalErrorsService>(ExportJournalErrorsService);
  });

  test('Service should be defined', () => {
    expect(exportJournalErrorsService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportJournalErrorsService['createExcel'](exportJournalErrorsDtoMock, exportJournalErrorsDataMock);

    expect(excel).toEqual(mockExcel);
  });
});
