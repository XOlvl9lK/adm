import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { FindIntegrationByDepartmentService } from './find-integration-by-department.service';

const mockRepository = {
  findOne: jest.fn(),
};

describe('FindIntegrationByDepartmentService', () => {
  let service: FindIntegrationByDepartmentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(IntegrationEntity),
          useValue: mockRepository,
        },
        FindIntegrationByDepartmentService,
      ],
    }).compile();

    service = module.get(FindIntegrationByDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find integration by department name', async () => {
    const departmentName = 'department';
    const integration = { departmentName };
    jest.spyOn(mockRepository, 'findOne').mockImplementation(() => integration);
    const result = await service.handle(departmentName);
    expect(result).toStrictEqual(integration);
  });
});
