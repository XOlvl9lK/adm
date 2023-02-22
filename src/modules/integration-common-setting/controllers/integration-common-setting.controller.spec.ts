import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { GetIntegrationCommonSettingService } from '../services/get-integration-common-setting.service';
import { UpdateIntegrationCommonSettingService } from '../services/update-integration-common-setting.service';
import { IntegrationCommonSettingController } from './integration-common-setting.controller';

const mockService = {
  handle: jest.fn(),
};

describe('IntegrationCommonSettingController', () => {
  let controller: IntegrationCommonSettingController;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [IntegrationCommonSettingController],
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: UpdateIntegrationCommonSettingService, useValue: mockService },
        { provide: GetIntegrationCommonSettingService, useValue: mockService },
      ],
    }).compile();
    controller = moduleRef.get(IntegrationCommonSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call get common setting service', async () => {
    const expected = 1;
    jest.spyOn(mockService, 'handle').mockImplementation(() => expected);
    const result = await controller.getCommonSetting();
    expect(result).toBe(expected);
  });
});
