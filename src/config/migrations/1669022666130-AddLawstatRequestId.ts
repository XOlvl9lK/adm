import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLawstatRequestId1669022666130 implements MigrationInterface {
  name = 'AddLawstatRequestId1669022666130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "lawstat_request_id" character varying`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."lawstat_request_id" IS 'идентификатор запроса Суды'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."lawstat_request_id" IS 'идентификатор запроса Суды'`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "lawstat_request_id"`);
  }
}
