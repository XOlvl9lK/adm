import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonSettingNameEnum } from '../domain/common-setting-name.enum';
import { IntegrationCommonSettingEntity } from '../domain/integration-common-setting.entity';
import { UpdateIntegrationCommonSettingService } from './update-integration-common-setting.service';

const mockRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

describe('UpdateIntegrationCommonSettingService', () => {
  let service: UpdateIntegrationCommonSettingService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: getRepositoryToken(IntegrationCommonSettingEntity), useValue: mockRepository },
        UpdateIntegrationCommonSettingService,
      ],
    }).compile();
    service = moduleRef.get(UpdateIntegrationCommonSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update settings', async () => {
    const expected = [{ key: CommonSettingNameEnum.GAS_PS_SIGN, value: '1' }];
    jest
      .spyOn(mockRepository, 'find')
      .mockImplementation(() => [{ key: CommonSettingNameEnum.GAS_PS_SIGN, value: '1' }]);
    jest.spyOn(mockRepository, 'save').mockImplementation((p) => p);
    const result = await service.handle({
      [CommonSettingNameEnum.GAS_PS_MESSAGE_RECEIVE_URL]: '',
      [CommonSettingNameEnum.SMEV_SEND_MESSAGE_URL]: '',
      [CommonSettingNameEnum.GAS_PS_SIGN_PASS]: '',
    });
    expect(result).toEqual(expected);
    expect(mockRepository.save).toHaveBeenCalledWith(expected);
  });
});
