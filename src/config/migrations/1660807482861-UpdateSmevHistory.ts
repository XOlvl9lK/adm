import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntagrationAndSmevHistory1660807482861 implements MigrationInterface {
  name = 'UpdateIntagrationAndSmevHistory1660807482861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "send_task_request"`);
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "send_task_request_with_signature" character varying`);
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "send_task_request_without_signature" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "send_task_request_without_signature"`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "send_task_request_with_signature"`);
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "send_task_request" character varying`);
  }
}
