import { BaseException } from '@common/base/exception.base';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { CreateExternalIntegrationService } from './create-external-integration.service';

const mockEntityManager = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockConnection = {
  transaction: jest.fn(),
};

describe('CreateExternalIntegrationService', () => {
  let service: CreateExternalIntegrationService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: Connection, useValue: mockConnection }, CreateExternalIntegrationService],
    }).compile();
    service = moduleRef.get(CreateExternalIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockPayload = {
    departmentId: 1,
    departmentName: '1',
    divisionId: 1,
    divisionName: '1',
    type: IntegrationTypeEnum.SPV as IntegrationTypeEnum.SPV,
    condition: ConditionTypeEnum.ACTIVE,
  };

  it('should throw error if integration with same departmentId and type already exists', async () => {
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => ({ id: 1 }));
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));

    try {
      await service.handle(mockPayload);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(BaseException);
      expect(mockEntityManager.findOne).toBeCalledWith(IntegrationEntity, {
        where: {
          departmentId: mockPayload.departmentId,
          type: mockPayload.type,
        },
      });
    }
  });

  it('should create integration without divisions', async () => {
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => null);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));

    const { createDate, updateDate, ...result } = await service.handle(mockPayload);
    expect(result).toStrictEqual(mockPayload);
  });

  it('should create integration with divisions', async () => {
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => null);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    const _mockPayload = {
      ...mockPayload,
      divisions: [{ divisionId: 1, divisionName: '1', path: '123' }],
    };
    const { createDate, updateDate, divisions, ...result } = await service.handle(_mockPayload);

    expect({
      ...result,
      divisions: divisions.map(({ createDate, updateDate, ...other }) => other),
    }).toStrictEqual(_mockPayload);
  });
});
