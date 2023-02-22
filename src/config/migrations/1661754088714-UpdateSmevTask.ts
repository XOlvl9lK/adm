import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSmevTask1661754088714 implements MigrationInterface {
  name = 'UpdateSmevTask1661754088714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "task_uuid" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "task_uuid" SET NOT NULL`);
  }
}
