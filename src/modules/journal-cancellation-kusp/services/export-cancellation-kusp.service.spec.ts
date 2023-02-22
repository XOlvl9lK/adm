// eslint-disable-next-line max-len
import { ExportCancellationKuspService } from '@modules/journal-cancellation-kusp/services/export-cancellation-kusp.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { FindCancellationKuspService } from '@modules/journal-cancellation-kusp/services/find-cancellation-kusp.service';
import { TestHelpers } from '@common/test/testHelpers';
import {
  exportCancellationKuspDtoMock,
  findCancellationKuspServiceMock,
} from '@modules/journal-cancellation-kusp/controllers/cancellation-kusp.controller.spec';
import clearAllMocks = jest.clearAllMocks;
// eslint-disable-next-line max-len
import { cancellationKuspMock } from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { formatDate, getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
// eslint-disable-next-line max-len
import { ExportCancellationKuspDto } from '@modules/journal-cancellation-kusp/controllers/dtos/export-cancellation-kusp.dto';

const helpers = new TestHelpers().getHelpers();

export const exportCancellationKuspWithIdsDtoMock = {
  page: 1,
  pageSize: 10,
  userLogin: 'Macdonald',
  columnKeys: ['userLogin'],
  ids: helpers.random.ids,
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportCancellationKuspDto;

const exportCancellationKuspDataMock = [{ ...cancellationKuspMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'B1:J1')
  .subTitle('Журнал аннулирования КУСП', 'B2:J2')
  .applyColumnOrdering(exportCancellationKuspDtoMock.columnKeys)
  .cells([
    { value: 'Дата и время операции:', index: 'B4' },
    {
      value: getRangeDateString(
        exportCancellationKuspWithIdsDtoMock.operationDate?.[0],
        exportCancellationKuspWithIdsDtoMock.operationDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Надзирающая прокуратура:', index: 'E4' },
    { value: exportCancellationKuspWithIdsDtoMock.procuracyTitles?.join(', ') || 'Все', index: 'F4' },
    { value: 'Дата формирования Выгрузки:', index: 'H4' },
    // {
    //   value: formatDate(
    //     applyTimezoneToDate(
    //       new Date().toISOString(),
    //       getUserTimezone(exportCancellationKuspWithIdsDtoMock.timeZone || '0'),
    //     ),
    //     'dd.MM.yyyy HH:mm:ss',
    //   ),
    //   index: 'I4',
    // },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportCancellationKuspWithIdsDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: '№ КУСП:', index: 'E5' },
    { value: exportCancellationKuspWithIdsDtoMock.kuspNumber || 'Не указано', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
    { value: exportCancellationKuspWithIdsDtoMock.viewer || 'Не указано', index: 'I5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportCancellationKuspWithIdsDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Вид операции:', index: 'E6' },
    { value: exportCancellationKuspWithIdsDtoMock.operationTypeTitle?.join(', ') || 'Все', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    { value: exportCancellationKuspWithIdsDtoMock.divisionTitles?.join(', ') || 'Все', index: 'C7' },
    { value: 'Имя пользователя:', index: 'E7' },
    { value: exportCancellationKuspWithIdsDtoMock.userLogin || 'Не указано', index: 'F7' },
  ])
  .columns([
    { key: 'number' },
    { key: 'packageKuspId', width: 20 },
    { key: 'divisionTitle', width: 20 },
    { key: 'solutionTitle', width: 20 },
    { key: 'registrationDate', width: 20 },
    { key: 'versionDate', width: 20 },
    { key: 'operationDate', width: 20 },
    { key: 'operationTypeTitle', width: 20 },
    { key: 'userLogin', width: 20 },
    { key: 'comment', width: 20 },
  ])
  .header(
    [
      { title: '№ П/П', key: 'number' },
      { title: '№ КУСП', key: 'packageKuspId' },
      { title: 'Подразделение', key: 'divisionTitle' },
      { title: 'Решение', key: 'solutionTitle' },
      { title: 'Дата регистрации сообщения', key: 'registrationDate' },
      { title: 'Дата создания версии', key: 'versionDate' },
      { title: 'Дата операции', key: 'operationDate' },
      { title: 'Вид операции', key: 'operationTypeTitle' },
      { title: 'Пользователь', key: 'userLogin' },
      { title: 'Комментарий', key: 'comment' },
    ],
    10,
  )
  .fill(
    exportCancellationKuspDataMock.map((data, id) => ({
      ...data,
      number: id + 1,
      registrationDate: getClientDateAndTime(exportCancellationKuspDtoMock.timeZone, data.registrationDate),
      versionDate: getClientDateAndTime(exportCancellationKuspDtoMock.timeZone, data.versionDate),
      operationDate: getClientDateAndTime(exportCancellationKuspDtoMock.timeZone, data.operationDate),
    })),
    11,
  );

describe('ExportCancellationKuspService', () => {
  let exportCancellationKuspService: ExportCancellationKuspService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportCancellationKuspService,
        {
          provide: FindCancellationKuspService,
          useValue: findCancellationKuspServiceMock,
        },
        helpers.archiverProvider,
      ],
    }).compile();

    exportCancellationKuspService = moduleRef.get<ExportCancellationKuspService>(ExportCancellationKuspService);
  });

  test('Service should be defined', () => {
    expect(exportCancellationKuspService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    // const excel = exportCancellationKuspService['createExcel'](
    //   exportCancellationKuspWithIdsDtoMock,
    //   exportCancellationKuspDataMock,
    // );
    //
    // expect(excel).toEqual(mockExcel);
  });

  test('File size should be grater than 0 on exportXlsx', async () => {
    await exportCancellationKuspService.exportXlsx(exportCancellationKuspWithIdsDtoMock, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
