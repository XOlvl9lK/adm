import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegrationSettings1658912377868 implements MigrationInterface {
  name = 'UpdateIntegrationSettings1658912377868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_catalogue" ADD "dpu_kusp_scheduler" text`);
    await queryRunner.query(`ALTER TABLE "integration_catalogue" ADD "statistical_card_scheduler" text`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "spv_filter" text`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "smev_filter" text`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_filter" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_filter"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "smev_filter"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "spv_filter"`);
    await queryRunner.query(`ALTER TABLE "integration_catalogue" DROP COLUMN "statistical_card_scheduler"`);
    await queryRunner.query(`ALTER TABLE "integration_catalogue" DROP COLUMN "dpu_kusp_scheduler"`);
  }
}
