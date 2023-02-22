import { TestHelpers } from '@common/test/testHelpers';
import {
  findNsiChangeDtoMock,
  nsiChangeMock,
} from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo.spec';
import { FindNsiChangeService } from '@modules/journal-nsi-change/services/find-nsi-change.service';
import { Test } from '@nestjs/testing';
import { NsiChangeElasticRepo } from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const nsiChangeElasticRepoMock = helpers.getMockElasticRepo(nsiChangeMock);

describe('FindNsiChangeService', () => {
  let findNsiChangeService: FindNsiChangeService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindNsiChangeService,
        {
          provide: NsiChangeElasticRepo,
          useValue: nsiChangeElasticRepoMock,
        },
      ],
    }).compile();

    findNsiChangeService = moduleRef.get<FindNsiChangeService>(FindNsiChangeService);
  });

  test('Service should be defined', () => {
    expect(findNsiChangeService).toBeDefined();
  });

  test('Should return nsiChange transformed', async () => {
    const response = await findNsiChangeService.findAll(findNsiChangeDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(nsiChangeMock));
  });

  test('Should return nsiChange by ids transformed', async () => {
    const response = await findNsiChangeService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(nsiChangeMock));
  });
});
