import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { FindIntegrationService } from './find-integration.service';

const mockRepository = {
  findOne: jest.fn(),
};

describe('FindIntegrationService', () => {
  let service: FindIntegrationService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: getRepositoryToken(IntegrationEntity), useValue: mockRepository },
        FindIntegrationService,
      ],
    }).compile();
    service = moduleRef.get(FindIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return integration by id', async () => {
    const id = 1;
    const expected = { id };
    jest.spyOn(mockRepository, 'findOne').mockImplementation((id) => ({ id }));
    const result = await service.handle(id);
    expect(result).toStrictEqual(expected);
    // eslint-disable-next-line prettier/prettier
    expect(mockRepository.findOne).toBeCalledWith(id, { relations: ['divisions'] });
  });
});
