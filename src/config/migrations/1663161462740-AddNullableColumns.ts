import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNullableColumns1663161462740 implements MigrationInterface {
  name = 'AddNullableColumns1663161462740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scheduler_task" ALTER COLUMN "start_date" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ALTER COLUMN "periodicity" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scheduler_task" ALTER COLUMN "periodicity" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ALTER COLUMN "start_date" SET NOT NULL`);
  }
}
