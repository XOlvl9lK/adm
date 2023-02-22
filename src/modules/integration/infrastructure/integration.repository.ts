import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Repository, EntityRepository, In, Not } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';

interface IsExists {
  departmentId: number;
  type: IntegrationTypeEnum;
}

@EntityRepository(IntegrationEntity)
export class IntegrationRepository extends Repository<IntegrationEntity> {
  async isExists({ departmentId, type }: IsExists) {
    const record = await this.findOne({ where: { departmentId, type, condition: Not(ConditionTypeEnum.ARCHIVED) } });
    return Boolean(record);
  }

  async isMnemonicExists(smevMnemonic: string) {
    const record = await this.findOne({
      where: {
        type: IntegrationTypeEnum.SMEV,
        condition: Not(ConditionTypeEnum.ARCHIVED),
        smevMnemonic,
      },
    });
    return Boolean(record);
  }
}
