import { TestHelpers } from '@common/test/testHelpers';
import { StatisticalCardSourceEnum } from '@modules/journal-statistical-card/domain/statistical-card-source.enum';
// eslint-disable-next-line max-len
import { journalStatisticalCardMock } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo.spec';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/export-journal-statistical-card.dto';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { findJournalStatisticalCardMockProvider } from '@modules/journal-statistical-card/controllers/journal-statistical-card.controller.spec';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardService } from '@modules/journal-statistical-card/services/export-journal-statistical-card.service';
import {
  applyTimezoneToDate,
  formatDate,
  getClientDateAndTime,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';
import { getRangeDateString } from '@common/utils/getRangeDateString';

const helpers = new TestHelpers().getHelpers();

const exportJournalStatisticalCardDtoMock = {
  page: 1,
  pageSize: 10,
  cardId: '62b2ee2e8972d6b461d8db78',
  operatorLogin: 'Moss',
  sourceTitle: [StatisticalCardSourceEnum.SCD],
  columnKeys: ['formNumber', 'cardId'],
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportJournalStatisticalCardDto;

const exportJournalStatisticalCardDataMock = [{ ...journalStatisticalCardMock, id: helpers.random.id }];

let isProsecutorChangeString = 'Не указано';
if (exportJournalStatisticalCardDtoMock.isProsecutorChange) {
  if (exportJournalStatisticalCardDtoMock.isProsecutorChange.length === 1) {
    if (exportJournalStatisticalCardDtoMock.isProsecutorChange.includes(true)) {
      isProsecutorChangeString = 'Да';
    } else if (exportJournalStatisticalCardDtoMock.isProsecutorChange.includes(false)) {
      isProsecutorChangeString = 'Нет';
    }
  } else {
    isProsecutorChangeString = 'Все';
  }
}

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:M1')
  .subTitle('Журнал обработки статистических карточек', 'A2:M2')
  .applyColumnOrdering(exportJournalStatisticalCardDtoMock.columnKeys)
  .columns([
    { key: 'number' },
    { key: 'ikud', width: 20 },
    { key: 'divisionTitle', width: 20 },
    { key: 'regionTitle', width: 20 },
    { key: 'divisionTitle', width: 30 },
    { key: 'formNumber', width: 20 },
    { key: 'cardId', width: 25 },
    { key: 'sourceTitle', width: 20 },
    { key: 'startProcessingDate', width: 30 },
    { key: 'endProcessingDate', width: 30 },
    { key: 'operatorLogin', width: 20 },
    { key: 'signer', width: 25 },
    { key: 'status', width: 25 },
    { key: 'isProsecutorChange', width: 25 },
  ])
  .cells([
    { value: 'Дата и время загрузки:', index: 'B4' },
    {
      value: getRangeDateString(
        exportJournalStatisticalCardDtoMock.startProcessingDate?.[0],
        exportJournalStatisticalCardDtoMock.startProcessingDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Статус:', index: 'E4' },
    { value: exportJournalStatisticalCardDtoMock.statusTitle?.join(', ') || 'Все', index: 'F4' },
    { value: 'Дата формирования выгрузки:', index: 'L4' },
    {
      value: formatDate(
        applyTimezoneToDate(
          new Date().toISOString(),
          getUserTimezone(exportJournalStatisticalCardDtoMock.timeZone || '0'),
        ),
        'dd.MM.yyyy HH:mm:ss',
      ),
      index: 'M4',
    },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportJournalStatisticalCardDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Идентификатор карточки:', index: 'E5' },
    { value: exportJournalStatisticalCardDtoMock.cardId || 'Не указано', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'L5' },
    { value: exportJournalStatisticalCardDtoMock.viewer || 'Не указано', index: 'M5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportJournalStatisticalCardDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Вид карты:', index: 'E6' },
    { value: exportJournalStatisticalCardDtoMock.cardType?.join(', ') || 'Все', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    { value: exportJournalStatisticalCardDtoMock.divisionTitles?.join(', ') || 'Все', index: 'C7' },
    { value: 'Источник:', index: 'E7' },
    { value: exportJournalStatisticalCardDtoMock.sourceTitle?.join(', ') || 'Все', index: 'F7' },
    { value: 'Надзирающая прокуратура:', index: 'B8' },
    { value: exportJournalStatisticalCardDtoMock.procuracyTitles?.join(', ') || 'Все', index: 'C8' },
    { value: 'Номер формы:', index: 'E8' },
    { value: exportJournalStatisticalCardDtoMock.formNumber?.join(', ') || 'Все', index: 'F8' },
    { value: 'Дата и время выставления статуса:', index: 'B9' },
    {
      value: getRangeDateString(
        exportJournalStatisticalCardDtoMock.statusDate?.[0],
        exportJournalStatisticalCardDtoMock.statusDate?.[1],
      ),
      index: 'C9',
    },
    { value: 'Оператор:', index: 'E9' },
    { value: exportJournalStatisticalCardDtoMock.operatorLogin || 'Не указано', index: 'F9' },
    { value: 'ИКУД:', index: 'B10' },
    { value: exportJournalStatisticalCardDtoMock.ikud || 'Не указано', index: 'C10' },
    { value: 'Внесены изменения прокурором', index: 'E10' },
    { value: isProsecutorChangeString, index: 'F10' },
  ])
  .header(
    [
      { title: '№ п/п', key: 'number' },
      { title: 'ИКУД', key: 'ikud' },
      { title: 'Подразделение', key: 'divisionTitle' },
      { title: 'Регион', key: 'regionTitle' },
      { title: 'Надзирающая прокуратура', key: 'divisionTitle' },
      { title: 'Номер формы', key: 'formNumber' },
      { title: 'Идентификатор карточки', key: 'cardId' },
      { title: 'Источник', key: 'sourceTitle' },
      { title: 'Время начала обработки', key: 'startProcessingDate' },
      { title: 'Время окончания обработки', key: 'endProcessingDate' },
      { title: 'Оператор', key: 'operatorLogin' },
      { title: 'Подписанты', key: 'signer' },
      { title: 'Статус', key: 'status' },
      { title: 'Внесены изменения прокурором', key: 'isProsecutorChange' },
    ],
    12,
  )
  .fill(
    exportJournalStatisticalCardDataMock.map((d, idx) => ({
      ...d,
      number: idx + 1,
      startProcessingDate: getClientDateAndTime(exportJournalStatisticalCardDtoMock.timeZone, d.startProcessingDate),
      endProcessingDate: getClientDateAndTime(exportJournalStatisticalCardDtoMock.timeZone, d.endProcessingDate),
      signer: d.signer
        ?.slice(0, 2)
        .map((s) => `${s.role}: ${s.fullName} ${s.position} ${s.divisionTitle}. Роль: ${s.role}`)
        .join('. '),
      status: d.status?.map((s) => s.title).join('. '),
      isProsecutorChange: d?.isProsecutorChange ? 'Да' : 'Нет',
    })),
    13,
  );

describe('ExportJournalStatisticalCardDto', () => {
  let exportJournalStatisticalCardDto: ExportJournalStatisticalCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportJournalStatisticalCardService,
        findJournalStatisticalCardMockProvider,
        helpers.archiverProvider,
      ],
    }).compile();

    exportJournalStatisticalCardDto = moduleRef.get<ExportJournalStatisticalCardService>(
      ExportJournalStatisticalCardService,
    );
  });

  test('Service should be defined', () => {
    expect(exportJournalStatisticalCardDto).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportJournalStatisticalCardDto['createExcel'](
      exportJournalStatisticalCardDtoMock,
      exportJournalStatisticalCardDataMock,
    );

    expect(excel).toEqual(mockExcel);
  });
});
