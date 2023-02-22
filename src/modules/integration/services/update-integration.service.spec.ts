import { BaseException } from '@common/base/exception.base';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { UpdateIntegrationService } from './update-integration.service';

const mockEntityManager = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockConnection = {
  transaction: jest.fn(),
};

describe('UpdateIntegrationService', () => {
  let service: UpdateIntegrationService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: Connection, useValue: mockConnection }, UpdateIntegrationService],
    }).compile();
    service = moduleRef.get(UpdateIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if integrationId not found', async () => {
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => null);
    try {
      await service.handle({ id: 1 });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(BaseException);
      expect(mockEntityManager.findOne).toBeCalledWith(IntegrationEntity, {
        where: { id: 1 },
        relations: ['divisions'],
      });
    }
  });

  it('should update integration without divisions', async () => {
    const expected = { id: 1, departmentId: '1', departmentName: '1' };
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => expected);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((_, p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    const payload = { id: expected.id, departmentId: 2, departmentName: '2' };
    const { updateDate, ...result } = await service.handle(payload);
    expect(result).toStrictEqual({ ...expected, ...payload });
    expect(mockEntityManager.save).toBeCalledWith(IntegrationEntity, {
      ...expected,
      ...payload,
    });
  });

  it('should update integration divisions without deleting divisions', async () => {
    // eslint-disable-next-line prettier/prettier
    const expected = { id: 1, departmentId: '1', departmentName: '1', divisions: [] };
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => expected);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((_, p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    // eslint-disable-next-line prettier/prettier
    const payload = { id: expected.id, divisions: [{ divisionId: 1, divisionName: '1', path: '1' }] };
    const { updateDate, divisions, ...result } = await service.handle(payload);
    expect({
      ...result,
      divisions: divisions.map(({ createDate, updateDate, ...d }) => d),
    }).toStrictEqual({ ...expected, ...payload });
    expect(mockEntityManager.save).toBeCalledWith(IntegrationEntity, {
      ...expected,
      ...payload,
    });
  });

  it('should update integration divisions with deleting divisions', async () => {
    const expected = {
      id: 1,
      departmentId: '1',
      departmentName: '1',
      divisions: [{ id: 1, divisionId: '1', divisionName: '1', path: '1' }],
    };
    jest.spyOn(mockEntityManager, 'findOne').mockImplementation(() => expected);
    jest.spyOn(mockEntityManager, 'create').mockImplementation((_, p) => p);
    jest.spyOn(mockEntityManager, 'save').mockImplementation((_, p) => p);
    jest.spyOn(mockConnection, 'transaction').mockImplementation(async (callback) => await callback(mockEntityManager));
    // eslint-disable-next-line prettier/prettier
    const payload = { id: expected.id, divisions: [] };
    const { updateDate, ...result } = await service.handle(payload);
    expect(result).toStrictEqual({ ...expected, ...payload });
    expect(mockEntityManager.save).toBeCalledWith(IntegrationEntity, {
      ...expected,
      ...payload,
    });
  });
});
