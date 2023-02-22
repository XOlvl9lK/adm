import { EntityTypeTitleEnum } from '@modules/journal-typical-violation/domain/entity-type-title.enum';
import { OperationTypeTitleEnum } from '@modules/journal-typical-violation/domain/operation-type-title.enum';
// eslint-disable-next-line max-len
import { typicalViolationsMock } from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo.spec';
import { TestHelpers } from '@common/test/testHelpers';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
// eslint-disable-next-line max-len
import { ExportTypicalViolationService } from '@modules/journal-typical-violation/services/export-typical-violation.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { findTypicalViolationsMockProvider } from '@modules/journal-typical-violation/controllers/typical-violations.controller.spec';
import { getRangeDateString } from '@common/utils/getRangeDateString';
// eslint-disable-next-line max-len
import { ExportTypicalViolationDto } from '@modules/journal-typical-violation/controllers/dtos/export-typical-violation.dto';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';

const helpers = new TestHelpers().getHelpers();

const exportTypicalViolationsDtoMock = {
  page: 1,
  pageSize: 10,
  userName: 'Wyatt',
  cardId: '62b2e885a09723076e917903',
  entityTypeTitle: [EntityTypeTitleEnum.CRIMINAL_CASE],
  operationTypeTitle: [OperationTypeTitleEnum.CONCLUSION_FROM_VIOLATION],
  columnKeys: ['cardId', 'operationTypeTitle', 'operationDate'],
  timeZone: '180',
  viewer: 'PROK_GP',
} as ExportTypicalViolationDto;

const exportTypicalViolationsDataMock = [{ ...typicalViolationsMock, id: helpers.random.id }];

const mockExcel = new ExcelHelper()
  .title('ГОСУДАРСТВЕННАЯ АВТОМАТИЗИРОВАННАЯ СИСТЕМА ПРАВОВОЙ СТАТИСТИКИ', 'A1:K1')
  .subTitle('Журнал изменений типовых нарушений', 'A2:K2')
  .applyColumnOrdering(exportTypicalViolationsDtoMock.columnKeys)
  .cells([
    { value: 'Дата и время операции', index: 'B4' },
    {
      value: getRangeDateString(
        exportTypicalViolationsDtoMock.operationDate?.[0],
        exportTypicalViolationsDtoMock.operationDate?.[1],
      ),
      index: 'C4',
    },
    { value: 'Идентификатор карточки', index: 'E4' },
    { value: exportTypicalViolationsDtoMock.cardId || 'Не указано', index: 'F4' },
    { value: 'Дата формирования выгрузки', index: 'J4' },
    { value: getClientDateAndTime(exportTypicalViolationsDtoMock.timeZone, new Date().toISOString()), index: 'K4' },
    { value: 'Ведомство:', index: 'B5' },
    { value: exportTypicalViolationsDtoMock.departmentTitles?.join(', ') || 'Все', index: 'C5' },
    { value: 'Номер формы:', index: 'E5' },
    { value: exportTypicalViolationsDtoMock.formNumber?.join(', ') || 'Все', index: 'F5' },
    { value: 'Пользователь, сформировавший выгрузку:', index: 'J5' },
    { value: exportTypicalViolationsDtoMock.viewer || 'Не указано', index: 'K5' },
    { value: 'Регион:', index: 'B6' },
    { value: exportTypicalViolationsDtoMock.regionTitles?.join(', ') || 'Все', index: 'C6' },
    { value: 'Вид сущности:', index: 'E6' },
    { value: exportTypicalViolationsDtoMock.entityTypeTitle?.join(', ') || 'Все', index: 'F6' },
    { value: 'Подразделение:', index: 'B7' },
    { value: exportTypicalViolationsDtoMock.divisionTitles?.join(', ') || 'Все', index: 'C7' },
    { value: 'Наименование типовой проверки:', index: 'E7' },
    { value: exportTypicalViolationsDtoMock.examinationTypeTitle?.join(', ') || 'Не указано', index: 'F7' },
    { value: 'Надзирающая прокуратура:', index: 'B8' },
    { value: exportTypicalViolationsDtoMock.procuracyTitles?.join(', ') || 'Все', index: 'C8' },
    { value: 'Вид действия:', index: 'E8' },
    { value: exportTypicalViolationsDtoMock.operationTypeTitle?.join(', ') || 'Все', index: 'F8' },
    { value: 'Дата версии:', index: 'B9' },
    {
      value: getRangeDateString(
        exportTypicalViolationsDtoMock.versionDate?.[0],
        exportTypicalViolationsDtoMock.versionDate?.[1],
      ),
      index: 'C9',
    },
    { value: 'Пользователь:', index: 'E9' },
    { value: exportTypicalViolationsDtoMock.userName || 'Не указано', index: 'F9' },
  ])
  .columns([
    { key: 'number' },
    { key: 'uniqueNumber', width: 20 },
    { key: 'cardId', width: 20 },
    { key: 'versionDate', width: 20 },
    { key: 'formNumber', width: 20 },
    { key: 'entityTypeTitle', width: 20 },
    { key: 'examinationTypeId', width: 20 },
    { key: 'operationTypeTitle', width: 20 },
    { key: 'operationDate', width: 20 },
    { key: 'comment', width: 20 },
    { key: 'userName', width: 20 },
  ])
  .header(
    [
      { title: '№ П/П', key: 'number' },
      { title: 'Уникальный номер (ИКУД, УНП, УНЛ)', key: 'uniqueNumber' },
      { title: 'Идентификатор', key: 'cardId' },
      { title: 'Дата версии', key: 'versionDate' },
      { title: 'Номер формы', key: 'formNumber' },
      { title: 'Вид сущности', key: 'entityTypeTitle' },
      { title: 'Наименование типовой проверки', key: 'examinationTypeId' },
      { title: 'Вид действия', key: 'operationTypeTitle' },
      { title: 'Дата и время операции', key: 'operationDate' },
      { title: 'Комментарий', key: 'comment' },
      { title: 'Пользователь', key: 'userName' },
    ],
    11,
  )
  .fill(
    exportTypicalViolationsDataMock.map((data, id) => ({
      ...data,
      number: id + 1,
      versionDate: getClientDateAndTime(exportTypicalViolationsDtoMock.timeZone, data.versionDate),
      operationDate: getClientDateAndTime(exportTypicalViolationsDtoMock.timeZone, data.operationDate),
      examinationTypeId: data.examinationTypeId,
    })),
    12,
  );

describe('ExportTypicalViolationService', () => {
  let exportTypicalViolationService: ExportTypicalViolationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExportTypicalViolationService, findTypicalViolationsMockProvider, helpers.archiverProvider],
    }).compile();

    exportTypicalViolationService = moduleRef.get<ExportTypicalViolationService>(ExportTypicalViolationService);
  });

  test('Service should be defined', () => {
    expect(exportTypicalViolationService).toBeDefined();
  });

  test('Should create correct excel object', () => {
    const excel = exportTypicalViolationService['createExcel'](
      exportTypicalViolationsDtoMock,
      exportTypicalViolationsDataMock,
    );

    expect(excel).toEqual(mockExcel);
  });
});
