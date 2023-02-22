/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchedulerTaskProperties1662968274362 implements MigrationInterface {
  name = 'AddSchedulerTaskProperties1662968274362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."scheduler_task_periodicity_enum" AS ENUM('DAILY', 'WEEKLY', 'EVERY_DECADE', 'MONTHLY', 'QUARTERLY', 'ANNUALY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "periodicity" "public"."scheduler_task_periodicity_enum" NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."periodicity" IS 'Периодичность'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "export_type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."scheduler_task_export_type_enum" AS ENUM('DPU_KUSP', 'STAT_REPORT', 'MANUAL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "export_type" "public"."scheduler_task_export_type_enum" NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."export_type" IS 'Тип выгрузки'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."export_type" IS 'Тип выгрузки'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "export_type"`);
    await queryRunner.query(`DROP TYPE "public"."scheduler_task_export_type_enum"`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ADD "export_type" character varying NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."periodicity" IS 'Периодичность'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "periodicity"`);
    await queryRunner.query(`DROP TYPE "public"."scheduler_task_periodicity_enum"`);
  }
}
