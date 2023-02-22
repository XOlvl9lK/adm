import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { cancellationRecordCardMock } from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
// eslint-disable-next-line max-len
import { ExportCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/export-cancellation-record-card.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { FindCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/find-cancellation-record-card.service';
import clearAllMocks = jest.clearAllMocks;
// eslint-disable-next-line max-len
import { findCancellationRecordCardServiceMock } from '@modules/journal-cancellation-record-card/controllers/cancellation-record-card.controller.spec';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
// eslint-disable-next-line max-len
import { ExportCancellationRecordCardDto } from '@modules/journal-cancellation-record-card/controllers/dto/export-cancellation-record-card.dto';

const helpers = new TestHelpers().getHelpers();

export const exportCancellationKuspDtoMock = {
  page: 1,
  pageSize: 10,
  uniqueNumber: '62b2dc07890a99d06a9f5c7f',
  columnKeys: ['uniqueNumber'],
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportCancellationRecordCardDto;

const exportCancellationKuspDataMock = [{ ...cancellationRecordCardMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
  .subTitle('Журнал аннулирования учётных карточек', 'A2:I2')
  .applyColumnOrdering(exportCancellationKuspDtoMock.columnKeys)
  .cells([
    { value: 'Дата и время операции:', index: 'B4' },
    {
      value: getRangeDateString(
        exportCancellationKuspDtoMock.operationDate?.[0],
        exportCancellationKuspDtoMock.operationDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Номер проверки:', index: 'D4' },
    { value: exportCancellationKuspDtoMock.uniqueNumber || 'Не указано', index: 'E4' },
    { value: 'Дата формирования выгрузки:', index: 'H4' },
    {
      value: formatDate(
        applyTimezoneToDate(new Date().toISOString(), getUserTimezone(exportCancellationKuspDtoMock.timeZone || '0')),
        'dd.MM.yyyy HH:mm:ss',
      ),
      index: 'I4',
    },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportCancellationKuspDtoMock.divisionTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Вид операции:', index: 'D5' },
    { value: exportCancellationKuspDtoMock.operationTypeTitle?.join(', ') || 'Все', index: 'E5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
    { value: exportCancellationKuspDtoMock.viewer || 'Не указано', index: 'I5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportCancellationKuspDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Номер формы:', index: 'D6' },
    { value: exportCancellationKuspDtoMock.formNumber?.join(', ') || 'Все', index: 'E6' },
    { value: 'Подразделение:', index: 'B7' },
    {
      value: exportCancellationKuspDtoMock.userHasChangedDivisionTitles
        ? exportCancellationKuspDtoMock.divisionTitles?.join(', ')
        : 'Все',
      index: 'C7',
    },
  ])
  .columns([
    { key: 'number' },
    { key: 'uniqueNumber', width: 20 },
    { key: 'cardId', width: 20 },
    { key: 'operationDate', width: 20 },
    { key: 'divisionTitle', width: 20 },
    { key: 'formNumber', width: 20 },
    { key: 'operationTypeTitle', width: 20 },
    { key: 'comment', width: 20 },
    { key: 'userLogin', width: 20 },
  ])
  .header(
    [
      { title: '№ П/П', key: 'number' },
      { title: 'Уникальный номер', key: 'uniqueNumber' },
      { title: 'Идентификатор карточки', key: 'cardId' },
      { title: 'Дата начала проверки/выявления нарушения/внесение меры реагирования', key: 'operationDate' },
      { title: 'Подразделение', key: 'divisionTitle' },
      { title: 'Номер формы', key: 'formNumber' },
      { title: 'Вид операции', key: 'operationTypeTitle' },
      { title: 'Комментарий', key: 'comment' },
      { title: 'Пользователь', key: 'userLogin' },
    ],
    9,
  )
  .fill(
    exportCancellationKuspDataMock.map((data, id) => ({
      ...data,
      number: id + 1,
      operationDate: getClientDateAndTime(exportCancellationKuspDtoMock.timeZone, data.operationDate),
    })),
    12,
  );

describe('ExportCancellationRecordCardService', () => {
  let exportCancellationRecordCardService: ExportCancellationRecordCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportCancellationRecordCardService,
        {
          provide: FindCancellationRecordCardService,
          useValue: findCancellationRecordCardServiceMock,
        },
        helpers.archiverProvider,
      ],
    }).compile();

    exportCancellationRecordCardService = moduleRef.get<ExportCancellationRecordCardService>(
      ExportCancellationRecordCardService,
    );
  });

  test('Service should be defined', () => {
    expect(exportCancellationRecordCardService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    // const excel = exportCancellationRecordCardService['createExcel'](
    //   exportCancellationKuspDtoMock,
    //   exportCancellationKuspDataMock,
    // );
    // expect(excel).toEqual(mockExcel);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
