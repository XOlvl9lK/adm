import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntegrationCommonSettingEntity } from '../domain/integration-common-setting.entity';
import { GetIntegrationCommonSettingService } from './get-integration-common-setting.service';

const mockRepository = {
  find: jest.fn(),
};

describe('GetIntegrationCommonSettingService', () => {
  let service: GetIntegrationCommonSettingService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: getRepositoryToken(IntegrationCommonSettingEntity), useValue: mockRepository },
        GetIntegrationCommonSettingService,
      ],
    }).compile();
    service = moduleRef.get(GetIntegrationCommonSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return common settings', async () => {
    const expected = 1;
    jest.spyOn(mockRepository, 'find').mockImplementation(() => expected);
    const result = await service.handle();
    expect(result).toBe(expected);
  });
});
