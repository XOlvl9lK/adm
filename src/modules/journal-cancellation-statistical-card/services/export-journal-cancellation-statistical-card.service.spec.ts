import { TestHelpers } from '@common/test/testHelpers';
import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
// eslint-disable-next-line max-len
import { journalCancellationStatisticalCardMock } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo.spec';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { OperationTypeEnum } from '@modules/journal-cancellation-statistical-card/domain/operation-type.enum';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/export-journal-cancellation-statistical-card.service';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;
// eslint-disable-next-line max-len
import { findJournalCancellationStatisticalCardServiceMockProvider } from '@modules/journal-cancellation-statistical-card/controllers/journal-cancellation-statistical-card.controller.spec';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/export-journal-cancellation-statistical-card.dto';

const helpers = new TestHelpers().getHelpers();

export const exportJournalCancellationStatisticalCardDtoMock = {
  page: 1,
  pageSize: 10,
  ikud: '62b2de17387e92b8c19bce2d',
  formNumber: [FormNumberEnum.UD],
  regionTitles: ['Регион 1'],
  operationDate: ['2020-10-10T04:15:43.847+04:00', '2010-12-30T14:26:22.847+04:00'] as [string, string],
  columnKeys: ['uniqueNumber'],
  cardId: '62b2de177e8bb4cba5e09a6c',
  operationType: [OperationTypeEnum.CANCELLATION],
  timeZone: '180',
  viewer: 'PROK_GP',
} as any;

const exportJournalCancellationStatisticalCardDataMock = [
  { ...journalCancellationStatisticalCardMock, id: helpers.random.id },
];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:I1')
  .subTitle('Журнал аннулирования статистических карточек', 'A2:I2')
  .applyColumnOrdering(exportJournalCancellationStatisticalCardDtoMock.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'ikud', width: 20 },
    { key: 'formNumber', width: 20 },
    { key: 'uniqueNumber', width: 20 },
    { key: 'versionDate', width: 30 },
    { key: 'cardId', width: 25 },
    { key: 'operationTypeTitle', width: 20 },
    { key: 'operationDate', width: 20 },
    { key: 'comment', width: 20 },
    { key: 'userLogin', width: 25 },
  ])
  .cells([
    { value: 'Дата и время операции:', index: 'B4' },
    {
      value: getRangeDateString(
        exportJournalCancellationStatisticalCardDtoMock.operationDate?.[0],
        exportJournalCancellationStatisticalCardDtoMock.operationDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'ИКУД:', index: 'E4' },
    { value: exportJournalCancellationStatisticalCardDtoMock.ikud || 'Не указано', index: 'F4' },
    { value: 'Дата формирования выгрузки', index: 'H4' },
    {
      value: getClientDateAndTime(exportJournalCancellationStatisticalCardDtoMock.timeZone, new Date().toISOString()),
      index: 'I4',
    },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportJournalCancellationStatisticalCardDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Идентификатор карточки:', index: 'E5' },
    { value: exportJournalCancellationStatisticalCardDtoMock?.cardId || 'Не указано', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'H5' },
    { value: exportJournalCancellationStatisticalCardDtoMock.viewer || 'Не указано', index: 'I5' },
    { value: 'Регион:', index: 'B6' },
    {
      value: exportJournalCancellationStatisticalCardDtoMock.userHasChangedDivisionTitles
        ? exportJournalCancellationStatisticalCardDtoMock.regionTitles?.join(', ')
        : 'Все',
      index: 'C6',
    },
    { value: 'Вид операции:', index: 'E6' },
    { value: exportJournalCancellationStatisticalCardDtoMock?.operationType?.join(', ') || 'Все', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    { value: exportJournalCancellationStatisticalCardDtoMock.divisionTitles?.join(', ') || 'Все', index: 'C7' },
    { value: 'Номер формы:', index: 'E7' },
    { value: exportJournalCancellationStatisticalCardDtoMock?.formNumber?.join(', ') || 'Все', index: 'F7' },
    { value: 'Надзирающая прокуратура:', index: 'B8' },
    { value: exportJournalCancellationStatisticalCardDtoMock.procuracyTitles?.join(', ') || 'Все', index: 'C8' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'ИКУД', key: 'ikud' },
      { title: 'Номер формы', key: 'formNumber' },
      { title: 'Уникальный номер (ИКУД, УНП, УНЛ)', key: 'uniqueNumber' },
      { title: 'Дата версии', key: 'versionDate' },
      { title: 'Идентификатор карточки', key: 'cardId' },
      { title: 'Вид операции', key: 'operationTypeTitle' },
      { title: 'Дата операции', key: 'operationDate' },
      { title: 'Комментарий', key: 'comment' },
      { title: 'Пользователь', key: 'userLogin' },
    ],
    10,
  )
  .fill(
    exportJournalCancellationStatisticalCardDataMock.map((d, idx) => ({
      ...d,
      number: idx + 1,
      versionDate: getClientDateAndTime(exportJournalCancellationStatisticalCardDtoMock.timeZone, d.versionDate),
      operationDate: getClientDateAndTime(exportJournalCancellationStatisticalCardDtoMock.timeZone, d.operationDate),
    })),
    11,
  );

describe('ExportJournalCancellationStatisticalCardService', () => {
  let exportJournalCancellationStatisticalCardService: ExportJournalCancellationStatisticalCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportJournalCancellationStatisticalCardService,
        findJournalCancellationStatisticalCardServiceMockProvider,
        helpers.archiverProvider,
      ],
    }).compile();

    exportJournalCancellationStatisticalCardService = moduleRef.get<ExportJournalCancellationStatisticalCardService>(
      ExportJournalCancellationStatisticalCardService,
    );
  });

  test('Service should be defined', () => {
    expect(exportJournalCancellationStatisticalCardService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    // const excel = exportJournalCancellationStatisticalCardService['createExcel'](
    //   exportJournalCancellationStatisticalCardDtoMock,
    //   exportJournalCancellationStatisticalCardDataMock,
    // );

    // expect(excel).toEqual(mockExcel);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
