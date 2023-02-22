import { SourceEnum } from '@modules/journal-kusp/domain/source.enum';
import { StatusEnum } from '@modules/journal-kusp/domain/status.enum';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';
import { ElasticMock } from '@common/test/elastic.mock';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';
import { Test } from '@nestjs/testing';
import { JournalKuspEntity } from '@modules/journal-kusp/domain/journal-kusp.entity';

export const journalKuspMock = {
  fileTitle: 'consectetur sit',
  packageKuspId: '62b2e47c16fcb2267c354588',
  createDate: '2022-02-06T07:35:41-04:00',
  allPackageRecordsNumber: 124,
  downloadedRecordsNumber: 127,
  errorProcessedRecordsNumber: 128,
  sourceTitle: SourceEnum.ZIP,
  startProcessingDate: '2013-05-11T12:50:33-04:00',
  endProcessingDate: '2022-05-01T11:55:41-04:00',
  packageSignatureDate: '2012-03-09T10:31:14-04:00',
  operatorLogin: 'Joann',
  statusTitle: StatusEnum.SUCCESS,
  divisionTitle: 'Подразделение 3',
  departmentTitle: 'Ведомство 2',
  regionTitle: 'Регион 4',
  kuspNumber: [
    {
      number: '62b2e47cb2cc5ce3022beccb',
      statusTitle: StatusEnum.SUCCESS,
      errorText: 'Ex labore velit cillum consectetur exercitation nostrud.',
    },
    {
      number: '62b2e47cafa421bc1621ba45',
      statusTitle: StatusEnum.SUCCESS,
      errorText: 'Esse cupidatat ea nostrud veniam deserunt commodo.',
    },
    {
      number: '62b2e47c6f1f13a96f464b30',
      statusTitle: StatusEnum.SUCCESS,
      errorText: 'Fugiat excepteur ut qui cillum proident fugiat.',
    },
    {
      number: '62b2e47c73a28c1464b1e55f',
      statusTitle: StatusEnum.SUCCESS,
      errorText: 'In ad adipisicing fugiat ipsum quis incididunt.',
    },
    {
      number: '62b2e47c9739083ef05a99c8',
      statusTitle: StatusEnum.SUCCESS,
      errorText: 'Ipsum irure veniam ad culpa Lorem culpa amet.',
    },
  ],
  fileLink: 'ad',
  signer: [
    {
      divisionTitle: 'incididunt ipsum',
      role: 'anim culpa',
      fullName: 'Nell Turner',
      position: 'irure nostrud',
      certificate: '62b2e47c2e609ebff27a3cef',
      signDate: '2021-03-08T02:19:15-04:00',
    },
    {
      divisionTitle: 'non quis',
      role: 'reprehenderit ad',
      fullName: 'Marshall Shepard',
      position: 'irure amet',
      certificate: '62b2e47c0e86076b5aa83a64',
      signDate: '2021-07-04T10:06:14-04:00',
    },
    {
      divisionTitle: 'ea magna',
      role: 'amet quis',
      fullName: 'Krista Weeks',
      position: 'esse nostrud',
      certificate: '62b2e47cf827aad4ccf48762',
      signDate: '2013-12-17T05:25:02-04:00',
    },
    {
      divisionTitle: 'consectetur ipsum',
      role: 'in dolor',
      fullName: 'Bettie Harding',
      position: 'in adipisicing',
      certificate: '62b2e47c3953aa537e82b0f1',
      signDate: '2008-04-17T03:22:24-05:00',
    },
    {
      divisionTitle: 'cillum aute',
      role: 'excepteur irure',
      fullName: 'Norma Dodson',
      position: 'officia labore',
      certificate: '62b2e47ccbf854733ba2ee10',
      signDate: '2009-06-02T09:58:58-05:00',
    },
  ],
} as JournalKuspEntity;

export const findJournalKuspDtoMock = {
  page: 1,
  pageSize: 10,
  fileTitle: 'consectetur sit',
  kuspNumber: '62b2e47cb2cc5ce3022beccb',
  signerName: 'Nell Turner',
  regionTitles: ['Регион 4'],
  packageTypes: [PackageTypeEnum.WITHOUT_SIGNATURE],
  statuses: [StatusEnum.SUCCESS],
  sources: [SourceEnum.SPV],
  operatorLogin: 'Joann',
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          'kuspNumber.number': { query: '62b2e47cb2cc5ce3022beccb' },
        },
      },
      {
        match: {
          fileTitle: { query: 'consectetur sit' },
        },
      },
      {
        match: {
          operatorLogin: { query: 'Joann' },
        },
      },
      {
        match: {
          'signer.fullName': { query: 'Nell Turner' },
        },
      },
    ],
    filter: [
      {
        terms: { regionTitle: ['Регион 4'] },
      },
      {
        terms: { sourceTitle: [SourceEnum.SPV] },
      },
      {
        terms: { statusTitle: [StatusEnum.SUCCESS] },
      },
    ],
    must_not: [
      {
        exists: { field: 'signer' },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(journalKuspMock)
  .addCount()
  .addMget(journalKuspMock)
  .build();

describe('JournalKuspElasticRepo', () => {
  let journalKuspElasticRepo: JournalKuspElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalKuspElasticRepo, elasticMockProvider],
    }).compile();

    journalKuspElasticRepo = moduleRef.get<JournalKuspElasticRepo>(JournalKuspElasticRepo);
  });

  test('Repo should be defined', () => {
    expect(journalKuspElasticRepo).toBeDefined();
  });

  test('Should return journalKusp', async () => {
    const result = await journalKuspElasticRepo.findAll(findJournalKuspDtoMock);

    expect(result).toEqual(helpers.getSearchResult(journalKuspMock));
  });

  test('Should get correct query', () => {
    const query = journalKuspElasticRepo['getQuery'](findJournalKuspDtoMock);

    expect(query).toEqual(mockQuery);
  });
});
