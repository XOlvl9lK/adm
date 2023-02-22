import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeIntegrationColumnsNullable1659363167153 implements MigrationInterface {
  name = 'MakeIntegrationColumnsNullable1659363167153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_external_system_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_unique_security_key" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_mnemonic" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_authority_certificate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_path" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_scheduler_dpu_kusp" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_scheduler_statistical_report" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "last_used_date" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "last_used_date" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_cron_statistical_report" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_scheduler_statistical_report" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_scheduler_dpu_kusp" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_path" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_authority_certificate" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_mnemonic" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_unique_security_key" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_external_system_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET NOT NULL`);
  }
}
