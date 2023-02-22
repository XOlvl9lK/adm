import { BaseException } from '@common/base/exception.base';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Test } from '@nestjs/testing';
import { Connection, Not } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { CreateManualExportIntegrationService } from './create-manual-export-integration.service';
// eslint-disable-next-line max-len
import { CreateManualExportIntegrationDto } from '@modules/integration/controllers/dtos/create-manual-export-integration.dto';

const mockEntityManager = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockConnection = {
  transaction: jest.fn(),
};

describe('CreateManualExportIntegrationService', () => {
  let service: CreateManualExportIntegrationService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: Connection, useValue: mockConnection }, CreateManualExportIntegrationService],
    }).compile();
    service = moduleRef.get(CreateManualExportIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockPayload = {
    departmentId: 1,
    departmentName: '1',
    condition: ConditionTypeEnum.ACTIVE,
  } as CreateManualExportIntegrationDto;

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
          type: IntegrationTypeEnum.MANUAL_EXPORT,
          condition: Not(ConditionTypeEnum.ARCHIVED),
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
    expect(result).toStrictEqual({
      ...mockPayload,
      type: IntegrationTypeEnum.MANUAL_EXPORT,
    });
    expect(mockEntityManager.save).toBeCalledWith({
      ...mockPayload,
      type: IntegrationTypeEnum.MANUAL_EXPORT,
    });
  });

  it('should create integration with divisions', async () => {
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => null);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    const _mockPayload = {
      ...mockPayload,
      divisions: [{ divisionId: 1, divisionName: '1', path: '123' }],
    } as CreateManualExportIntegrationDto;
    const { createDate, updateDate, divisions, ...result } = await service.handle(_mockPayload);
    expect({
      ...result,
      divisions: divisions.map(({ createDate, updateDate, ...other }) => other),
    }).toStrictEqual({
      ..._mockPayload,
      type: IntegrationTypeEnum.MANUAL_EXPORT,
    });
    expect(mockEntityManager.save).toBeCalledWith({
      ..._mockPayload,
      type: IntegrationTypeEnum.MANUAL_EXPORT,
    });
  });
});
