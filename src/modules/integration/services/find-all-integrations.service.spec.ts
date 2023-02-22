import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Not } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { FindAllIntegrationsService } from './find-all-integrations.service';

const mockRepository = {
  findAndCount: jest.fn(),
};

describe('FindAllIntegrationsService', () => {
  let service: FindAllIntegrationsService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: getRepositoryToken(IntegrationEntity), useValue: mockRepository },
        FindAllIntegrationsService,
      ],
    }).compile();
    service = moduleRef.get(FindAllIntegrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct result if one type received', async () => {
    const expected = { data: [], total: 0 };
    jest.spyOn(mockRepository, 'findAndCount').mockImplementation(() => [expected.data, expected.total]);
    const result = await service.handle({ type: IntegrationTypeEnum.SPV });
    expect(result).toStrictEqual(expected);
    expect(mockRepository.findAndCount).toBeCalledWith({
      where: {
        type: IntegrationTypeEnum.SPV,
        condition: Not(ConditionTypeEnum.ARCHIVED),
      },
      take: 10,
      skip: 0,
      relations: ['divisions'],
      order: { createDate: 'DESC' },
    });
  });

  it('should return correct result if array of types received', async () => {
    const expected = { data: [], total: 0 };
    jest.spyOn(mockRepository, 'findAndCount').mockImplementation(() => [expected.data, expected.total]);
    const types = [IntegrationTypeEnum.SPV, IntegrationTypeEnum.SMEV];
    const result = await service.handle({ type: types });
    expect(result).toStrictEqual(expected);
    expect(mockRepository.findAndCount).toBeCalledWith({
      where: { type: In(types), condition: Not(ConditionTypeEnum.ARCHIVED) },
      take: 10,
      skip: 0,
      relations: ['divisions'],
      order: { createDate: 'DESC' },
    });
  });
});
