import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComments1662387980471 implements MigrationInterface {
  name = 'AddComments1662387980471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."send_task_response" IS 'Решение задачи. XML ответа'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error_description" IS 'Описание ошибки'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error_description" IS 'Решение задачи. XML ответа'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."send_task_response" IS NULL`);
  }
}
