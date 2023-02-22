import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegration1660899146845 implements MigrationInterface {
  name = 'UpdateIntegration1660899146845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ADD "spv_cert" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "spv_cert"`);
  }
}
