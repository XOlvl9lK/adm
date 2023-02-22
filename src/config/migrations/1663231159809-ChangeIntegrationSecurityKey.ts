import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIntegrationSecurityKey1663231159809 implements MigrationInterface {
  name = 'ChangeIntegrationSecurityKey1663231159809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "spv_unique_security_key" TO "spvLogin"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "spvLogin" TO "spv_unique_security_key"`);
  }
}
