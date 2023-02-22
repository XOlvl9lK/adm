import { NsiChangeObjectEnum } from '@modules/journal-nsi-change/domain/nsi-change-object.enum';
import { NsiChangeActionEnum } from '@modules/journal-nsi-change/domain/nsi-change-action.enum';
import { ElasticMock } from '@common/test/elastic.mock';
import { NsiChangeElasticRepo } from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;

export const nsiChangeMock = {
  eventDate: '2015-05-24T08:40:29-04:00',
  userName: 'Romero',
  ipAddress: '8.107.242.230',
  sessionId: '62b2e6b3b02eddfda5e799a4',
  objectTitle: NsiChangeObjectEnum.CATALOGUE,
  eventTitle: NsiChangeActionEnum.CREATE,
};

export const findNsiChangeDtoMock = {
  page: 1,
  pageSize: 10,
  userName: 'Romero',
  ipAddress: '8.107.242.230',
  eventDate: ['2015-05-24T08:40:29-04:00', '2015-05-24T08:40:29-04:00'] as [string, string],
  eventTitle: [NsiChangeActionEnum.CREATE],
  objectTitle: [NsiChangeObjectEnum.CATALOGUE],
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          userName: { query: 'Romero' },
        },
      },
      {
        match: {
          ipAddress: { query: '8.107.242.230' },
        },
      },
    ],
    filter: [
      {
        range: {
          eventDate: {
            gte: '2015-05-24T08:40:29-04:00',
            lte: '2015-05-24T08:40:29-04:00',
          },
        },
      },
      {
        terms: { objectTitle: [NsiChangeObjectEnum.CATALOGUE] },
      },
      {
        terms: { eventTitle: [NsiChangeActionEnum.CREATE] },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(nsiChangeMock)
  .addCount()
  .addMget(nsiChangeMock)
  .build();

describe('NsiChangeElasticRepo', () => {
  let nsiChangeElasticRepo: NsiChangeElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [NsiChangeElasticRepo, elasticMockProvider],
    }).compile();

    nsiChangeElasticRepo = moduleRef.get<NsiChangeElasticRepo>(NsiChangeElasticRepo);
  });

  test('Repo should be defined', () => {
    expect(nsiChangeElasticRepo).toBeDefined();
  });

  test('Should return nsiChange', async () => {
    const result = await nsiChangeElasticRepo.findAll(findNsiChangeDtoMock);

    expect(result).toEqual(helpers.getSearchResult(nsiChangeMock));
  });

  test('Should get correct query', () => {
    const query = nsiChangeElasticRepo['getQuery'](findNsiChangeDtoMock);

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
