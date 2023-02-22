import 'reflect-metadata';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateManualExportIntegration } from '@modules/integration/services/create-manual-export-integration.service';
import { CreateManualExportIntegrationDto } from './create-manual-export-integration.dto';

describe('CreateManualExportIntegrationDto', () => {
  it('should pass validation', async () => {
    const payload: CreateManualExportIntegration = {
      condition: ConditionTypeEnum.ACTIVE,
      departmentId: 1,
      departmentName: '1',
      divisionId: 1,
      divisionName: '1',
    };
    const dto = plainToInstance(CreateManualExportIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(0);
  });

  it('should throw error if dto missing some properties', async () => {
    const payload: CreateManualExportIntegration = {} as CreateManualExportIntegration;
    const dto = plainToInstance(CreateManualExportIntegrationDto, payload);
    const result = await validate(dto);
    expect(result).toHaveLength(5);
  });
});
