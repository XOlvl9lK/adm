import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { FindUniqueDepartments } from '@modules/integration/services/find-unique-departments.service';
import { IsEnum } from 'class-validator';

export class FindUniqueDepartmentsDto implements FindUniqueDepartments {
  @IsEnum(IntegrationTypeEnum, { each: true })
  integrationType: IntegrationTypeEnum[];
}
