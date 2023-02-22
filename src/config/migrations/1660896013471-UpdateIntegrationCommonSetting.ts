/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegrationCommonSetting1660896013471 implements MigrationInterface {
  name = 'UpdateIntegrationCommonSetting1660896013471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."integration_common_setting_key_enum" RENAME TO "integration_common_setting_key_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integration_common_setting_key_enum" AS ENUM('GAS_PS_SIGN', 'SMEV_SIGN', 'GAS_PS_MESSAGE_RECEIVE_URL', 'SMEV_SEND_MESSAGE_URL', 'GAS_PS_SIGN_PASS')`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ALTER COLUMN "key" TYPE "public"."integration_common_setting_key_enum" USING "key"::"text"::"public"."integration_common_setting_key_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."integration_common_setting_key_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."integration_common_setting_key_enum_old" AS ENUM('GAS_PS_SIGN', 'SMEV_SIGN', 'GAS_PS_MESSAGE_RECEIVE_URL', 'SMEV_SEND_MESSAGE_URL', 'SMEV_RECEIVE_MESSAGE_URL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ALTER COLUMN "key" TYPE "public"."integration_common_setting_key_enum_old" USING "key"::"text"::"public"."integration_common_setting_key_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."integration_common_setting_key_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."integration_common_setting_key_enum_old" RENAME TO "integration_common_setting_key_enum"`,
    );
  }
}
