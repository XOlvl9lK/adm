import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeIntegrationColumnsNullable11659364731082 implements MigrationInterface {
  name = 'MakeIntegrationColumnsNullable11659364731082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "scheduler_dpu_kusp" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "cron_dpu_kusp" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "scheduler_statistical_report" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "cron_statistical_report" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_cron_dpu_kusp" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_cron_dpu_kusp" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "cron_statistical_report" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "scheduler_statistical_report" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "cron_dpu_kusp" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration_division" ALTER COLUMN "scheduler_dpu_kusp" SET NOT NULL`);
  }
}
