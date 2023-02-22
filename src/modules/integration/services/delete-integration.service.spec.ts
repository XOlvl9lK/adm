import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { DeleteIntegrationService } from './delete-integration.service';

const mockEntityManager = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockConnection = {
  transaction: jest.fn(),
};

describe('DeleteIntegrationService', () => {
  let service: DeleteIntegrationService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: Connection, useValue: mockConnection }, DeleteIntegrationService],
    }).compile();
    service = module.get(DeleteIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save entity if it exists', async () => {
    const mockEntity = {
      condition: 'ACTIVE',
    };
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => mockEntity);
    jest.spyOn(mockEntityManager, 'save').mockImplementation(() => null);
    const id = 1;
    await service.handle({ id });
    expect(mockEntityManager.findOne).toBeCalledWith(IntegrationEntity, id);
    expect(mockEntityManager.save).toBeCalled();
  });

  it('should not save entity if it does not exist', async () => {
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => null);
    jest.spyOn(mockEntityManager, 'save').mockImplementation(() => null);
    const id = 1;
    await service.handle({ id });
    expect(mockEntityManager.findOne).toBeCalledWith(IntegrationEntity, id);
    expect(mockEntityManager.save).not.toBeCalled();
  });
});
