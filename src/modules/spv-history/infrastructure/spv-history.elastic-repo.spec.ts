import { ElasticMock } from '@common/test/elastic.mock';
import { SpvHistoryElasticRepo } from '@modules/spv-history/infrastructure/spv-history.elastic-repo';
import { Test } from '@nestjs/testing';
import { SpvHistoryEntity } from '@modules/spv-history/domain/spv-history.entity';

export const spvHistoryMock = {
  requestNumber: 6,
  requestState: 'COMPLETED',
  requestMethod: {
    name: 'KuspPackageUploadRequest',
    methodName: 'Загрузка в ГАС ПС пакетов записей КУСП',
  },
  startDate: '2022-06-30T21:39:29.971084',
  finishDate: '2022-06-30T21:39:32.576225',
  // eslint-disable-next-line max-len, prettier/prettier
  requestXmlUrl: 'http://172.29.30.58:9000/integration/spv/messages/outbb8998b7-a9ec-4ffa-a346-09c6c42902c7?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=integration-5Msk1V3xfaWzHtBsMnlCQ%2F20220630%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220630T183932Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=352ae2526a3de719b24b49725129a7f2192ee202be2cb46ad82103466b73630e',
  responseXmlUrl: null,
  integrationName: '1003',
  uniqueSecurityKey: 'F3pXYYocSTFK+Khll3Z0lH4KxJk=',
} as any as SpvHistoryEntity;

export const findSpvHistoryDtoMock = {
  page: 1,
  pageSize: 10,
  startDate: [new Date('2022-06-30T21:39:29.971084').toString(), new Date('2022-06-30T21:39:29.971084').toString()] as [
    string,
    string,
  ],
};

const mockQuery = {
  bool: {
    filter: [
      {
        range: {
          startDate: {
            gte: new Date('2022-06-30T21:39:29.971084').toString(),
            lte: new Date('2022-06-30T21:39:29.971084').toString(),
          },
        },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(spvHistoryMock)
  .addCount()
  .addMget(spvHistoryMock)
  .build();

describe('SpvHistoryElasticRepo', () => {
  let spvHistoryElasticRepo: SpvHistoryElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SpvHistoryElasticRepo, elasticMockProvider],
    }).compile();

    spvHistoryElasticRepo = moduleRef.get<SpvHistoryElasticRepo>(SpvHistoryElasticRepo);
  });

  test('Repo should be defined', () => {
    expect(spvHistoryElasticRepo).toBeDefined();
  });

  test('Should get correct query', () => {
    const query = spvHistoryElasticRepo['getQuery'](findSpvHistoryDtoMock);

    expect(query).toEqual(mockQuery);
  });

  test('Should return last request number', async () => {
    const lastRequestNumber = await spvHistoryElasticRepo.getLastRequestNumber();

    expect(lastRequestNumber).toBe(6);
  });
});
