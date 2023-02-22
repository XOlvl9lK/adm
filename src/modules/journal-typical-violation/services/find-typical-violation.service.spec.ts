import { TestHelpers } from '@common/test/testHelpers';
import {
  findTypicalViolationsDtoMock,
  typicalViolationsMock,
} from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindTypicalViolationService } from '@modules/journal-typical-violation/services/find-typical-violation.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { TypicalViolationsElasticRepo } from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const typicalViolationElasticRepoMock = helpers.getMockElasticRepo(typicalViolationsMock);

describe('FindTypicalViolationService', () => {
  let findTypicalViolationService: FindTypicalViolationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindTypicalViolationService,
        {
          provide: TypicalViolationsElasticRepo,
          useValue: typicalViolationElasticRepoMock,
        },
      ],
    }).compile();

    findTypicalViolationService = moduleRef.get<FindTypicalViolationService>(FindTypicalViolationService);
  });

  test('Service should be defined', () => {
    expect(findTypicalViolationService).toBeDefined();
  });

  test('Should return typicalViolations transformed', async () => {
    const response = await findTypicalViolationService.findAll(findTypicalViolationsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(typicalViolationsMock));
  });

  test('Should return typicalViolations by ids transformed', async () => {
    const response = await findTypicalViolationService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(typicalViolationsMock));
  });
});
