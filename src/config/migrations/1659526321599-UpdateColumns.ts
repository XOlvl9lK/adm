import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumns1659526321599 implements MigrationInterface {
  name = 'UpdateColumns1659526321599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_cron_statistical_report" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_cron_statistical_report" SET NOT NULL`);
  }
}
