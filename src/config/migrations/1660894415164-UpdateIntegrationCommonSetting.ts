import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegrationCommonSetting1660894415164 implements MigrationInterface {
  name = 'UpdateIntegrationCommonSetting1660894415164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_common_setting" ADD "file" bytea`);
    await queryRunner.query(`ALTER TABLE "integration_common_setting" ADD "file_name" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "file_name"`);
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "file"`);
  }
}
