// eslint-disable-next-line max-len
import { IntegrationCommonSettingEntity } from '@modules/integration-common-setting/domain/integration-common-setting.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { formatDate } from '@common/utils/getClientDateAndTime';

const directory = join(process.cwd(), 'assets');

export class AddCommonSettingValues1665646381930 implements MigrationInterface {
  name = 'AddCommonSettingValues1665646381930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const entityManager = queryRunner.connection.createEntityManager(queryRunner);
    const commonSettings = await entityManager.find(IntegrationCommonSettingEntity);
    const [gasPsSign, smevSign] = await Promise.all([
      readFile(join(directory, 'GAS_PS_SIGN.pfx')),
      readFile(join(directory, 'SMEV_SIGN.cer')),
    ]);

    const values = [
      {
        key: CommonSettingNameEnum.GAS_PS_SIGN,
        file: gasPsSign,
        fileName: 'gasps.pfx',
      },
      {
        key: CommonSettingNameEnum.GAS_PS_SIGN_PASS,
        value: '12345678',
      },
      {
        key: CommonSettingNameEnum.SMEV_SIGN,
        file: smevSign,
        fileName: 'smev.cer',
      },
      {
        key: CommonSettingNameEnum.GAS_PS_MESSAGE_RECEIVE_URL,
        value: '/integration',
      },
      {
        key: CommonSettingNameEnum.SMEV_SEND_MESSAGE_URL,
        value: 'http://smev3-n0.test.gosuslugi.ru:5000/transport_1_0_2/',
      },
    ];

    Object.values(CommonSettingNameEnum).map((v) => {
      const entity = commonSettings.find(({ key }) => v === key);
      // eslint-disable-next-line prettier/prettier
      if (!entity) throw new Error(`IntegrationCommonSettingEntity with key ${v} not found`);
      const value = values.find(({ key }) => v === key);
      // eslint-disable-next-line prettier/prettier
      if (!value) throw new Error(`Value for IntegrationCommonSettingEntity with key ${v} not found`);
      Object.entries(value).forEach(([key, v]) => {
        entity[key] = v;
      });
      entity.updateDate = formatDate(new Date().toISOString(), "yyyy-MM-dd'T'hh:mm:ssXXX");
    });
    await entityManager.save(commonSettings);
  }

  public async down(): Promise<void> {
    console.log(this.name, 'down');
  }
}
