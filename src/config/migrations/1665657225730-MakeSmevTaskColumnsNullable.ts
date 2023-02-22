import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSmevTaskColumnsNullable1665657225730 implements MigrationInterface {
  name = 'MakeSmevTaskColumnsNullable1665657225730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "last_used_date"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "last_used_date" text`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."last_used_date" IS 'Дата последней выгрузки'`);
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "get_task_request" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "get_task_response" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "get_task_response" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "get_task_request" SET NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."last_used_date" IS 'Дата последней выгрузки'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "last_used_date"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "last_used_date" TIMESTAMP`);
  }
}
