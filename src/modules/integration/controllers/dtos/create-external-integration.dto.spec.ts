import 'reflect-metadata';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { CreateExternalIntegration } from '@modules/integration/services/create-external-integration.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateExternalIntegrationDto } from './create-external-integration.dto';

describe('CreateExternalIntegrationDto', () => {
  it('should pass validation', async () => {
    const payload: CreateExternalIntegration = {
      type: IntegrationTypeEnum.SPV,
      condition: ConditionTypeEnum.ACTIVE,
      departmentId: 1,
      departmentName: '1',
      divisionId: 1,
      divisionName: '1',
    };
    const dto = plainToInstance(CreateExternalIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('should throw error if dto has wrong integration type', async () => {
    const payload: CreateExternalIntegration = {
      type: IntegrationTypeEnum.MANUAL_EXPORT as IntegrationTypeEnum.SPV,
      condition: ConditionTypeEnum.ACTIVE,
      departmentId: 1,
      departmentName: '1',
      divisionId: 1,
      divisionName: '1',
    };
    const dto = plainToInstance(CreateExternalIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(1);
  });

  it('should throw error if dto missing some properties', async () => {
    const payload: CreateExternalIntegration = {} as CreateExternalIntegration;
    const dto = plainToInstance(CreateExternalIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(6);
  });
});
