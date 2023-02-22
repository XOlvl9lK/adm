import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SmevHistoryRepository } from '@modules/smev-history/infrastructure/smev-history.repository';
import { plainToInstance } from 'class-transformer';
import { IntegrationEntity } from '@modules/integration/domain/integration/integration.entity';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { SmevHistoryStateEnum } from '@modules/smev-history/domain/smev-history-state.enum';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';

const mockSmevHistory = {
  integration: plainToInstance(IntegrationEntity, {
    id: 1,
    type: IntegrationTypeEnum.SMEV,
    condition: ConditionTypeEnum.ACTIVE,
    departmentId: 1,
    departmentName: 'departmentName',
  }),
  state: SmevHistoryStateEnum.ACK,
  taskUuid: 'taskUuid',
  methodName: 'methodName',
  replyTo: 'replyTo',
  getTaskRequest: 'getTaskRequest',
  getTaskResponse: 'getTaskResponse',
};

export const mockSmevHistoryInstance = plainToInstance(SmevHistoryEntity, mockSmevHistory);

export const mockSmevHistoryRepo = {
  findAll: jest.fn().mockResolvedValue([[mockSmevHistoryInstance], 1]),
  findByIds: jest.fn().mockResolvedValue([mockSmevHistoryInstance]),
};

describe('FindSmevHistoryService', () => {
  let findSmevHistoryService: FindSmevHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindSmevHistoryService,
        {
          provide: getRepositoryToken(SmevHistoryRepository),
          useValue: mockSmevHistoryRepo,
        },
      ],
    }).compile();

    findSmevHistoryService = moduleRef.get(FindSmevHistoryService);
  });

  test('Should return all smevHistory and count', async () => {
    const result = await findSmevHistoryService.findAll({});

    expect(result).toEqual({
      data: [mockSmevHistoryInstance],
      total: 1,
    });
  });

  test('Should return smevHistory by ids', async () => {
    const result = await findSmevHistoryService.findByIds([1]);

    expect(result).toEqual({
      data: [mockSmevHistoryInstance],
      total: 1,
    });
    expect(mockSmevHistoryRepo.findByIds).toHaveBeenCalledWith([1]);
  });
});
