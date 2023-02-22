/* eslint-disable max-len */
import { CommonSettingNameEnum } from '@modules/integration-common-setting/domain/common-setting-name.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIntegrationCommonSetting1659446255339 implements MigrationInterface {
  name = 'CreateIntegrationCommonSetting1659446255339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."integration_common_setting_key_enum" AS ENUM('GAS_PS_SIGN', 'SMEV_SIGN', 'GAS_PS_MESSAGE_RECEIVE_URL', 'SMEV_SEND_MESSAGE_URL', 'GAS_PS_SIGN_PASS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "integration_common_setting" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "key" "public"."integration_common_setting_key_enum" NOT NULL, "value" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_1a7bc8d793cacfcf916704220ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO public."integration_common_setting"(key, value) VALUES ${Object.values(CommonSettingNameEnum)
        .map((name) => `('${name}', '')`)
        .join(', ')}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "integration_common_setting"`);
    await queryRunner.query(`DROP TYPE "public"."integration_common_setting_key_enum"`);
  }
}
