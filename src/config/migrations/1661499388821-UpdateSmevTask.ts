import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSmevTask1661499388821 implements MigrationInterface {
  name = 'UpdateSmevTask1661499388821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "method_name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "reply_to" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "reply_to" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "smev_task" ALTER COLUMN "method_name" SET NOT NULL`);
  }
}
