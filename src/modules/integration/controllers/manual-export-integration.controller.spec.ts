import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CreateManualExportIntegrationService } from '../services/create-manual-export-integration.service';
import { DeleteIntegrationService } from '../services/delete-integration.service';
import { FindAllIntegrationsService } from '../services/find-all-integrations.service';
import { FindIntegrationService } from '../services/find-integration.service';
import { UpdateIntegrationService } from '../services/update-integration.service';
import { ManualExportIntegrationController } from './manual-export-integration.controller';

const mockService = {
  handle: jest.fn(),
};

describe('ManualExportIntegrationController', () => {
  let controller: ManualExportIntegrationController;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [ManualExportIntegrationController],
      providers: [
        // eslint-disable-next-line prettier/prettier
        { provide: CreateManualExportIntegrationService, useValue: mockService },
        { provide: UpdateIntegrationService, useValue: mockService },
        { provide: DeleteIntegrationService, useValue: mockService },
        { provide: FindIntegrationService, useValue: mockService },
        { provide: FindAllIntegrationsService, useValue: mockService },
      ],
    }).compile();
    controller = moduleRef.get(ManualExportIntegrationController);
  });

  it('should pass dto to create service', async () => {
    jest.spyOn(mockService, 'handle').mockImplementation((p) => p);
    const payload = {
      condition: ConditionTypeEnum.ACTIVE,
      departmentId: 1,
      departmentName: '1',
      manualExportFilter: null,
      divisions: [],
    };
    const result = await controller.create(payload);
    expect(result).toStrictEqual(payload);
    expect(mockService.handle).toBeCalledWith(payload);
  });

  it('should pass dto to update service', async () => {
    jest.spyOn(mockService, 'handle').mockImplementation((p) => p);
    const payload = {
      id: 1,
      departmentId: 1,
      departmentName: '1',
    };
    const result = await controller.update(payload);
    expect(result).toStrictEqual(payload);
    expect(mockService.handle).toBeCalledWith(payload);
  });

  it('should pass id to delete integration', async () => {
    jest.spyOn(mockService, 'handle').mockImplementation((p) => p);
    const id = 1;
    const result = await controller.delete(id);
    expect(result).toBe(id);
    expect(mockService.handle).toBeCalledWith(id);
  });

  it('should pass id to find integration', async () => {
    jest.spyOn(mockService, 'handle').mockImplementation((p) => p);
    const id = 1;
    const result = await controller.findOne(id);
    expect(result).toBe(id);
    expect(mockService.handle).toBeCalledWith(id);
  });

  it('should pass dto to find all integrations', async () => {
    jest.spyOn(mockService, 'handle').mockImplementation((p) => p);
    const payload = { page: 1, pageSize: 10 };
    const result = await controller.findAll(payload);
    const { MANUAL_EXPORT } = IntegrationTypeEnum;
    expect(result).toStrictEqual({ ...payload, type: MANUAL_EXPORT });
    expect(mockService.handle).toBeCalledWith({
      ...payload,
      type: MANUAL_EXPORT,
    });
  });
});
