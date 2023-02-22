/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileHistoryEntity1662634489999 implements MigrationInterface {
  name = 'AddFileHistoryEntity1662634489999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "scheduler_task"`);
    await queryRunner.query(
      `CREATE TABLE "scheduler_task" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "integration_id" integer, "planned_start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL, "error_description" character varying, "export_type" character varying NOT NULL, "file_url" character varying, CONSTRAINT "PK_b03f60cf2633e18d1a65be56700" PRIMARY KEY ("id")); COMMENT ON COLUMN "scheduler_task"."id" IS 'ID Сущности'; COMMENT ON COLUMN "scheduler_task"."create_date" IS 'Дата и время создания сущности'; COMMENT ON COLUMN "scheduler_task"."update_date" IS 'Дата и время последнего обновления сущности'; COMMENT ON COLUMN "scheduler_task"."integration_id" IS 'ID внешнего взаимодействия'; COMMENT ON COLUMN "scheduler_task"."planned_start_date" IS 'Запланированная дата начала'; COMMENT ON COLUMN "scheduler_task"."start_date" IS 'Дата начала'; COMMENT ON COLUMN "scheduler_task"."status" IS 'Статус'; COMMENT ON COLUMN "scheduler_task"."error_description" IS 'Описание ошибки (если есть)'; COMMENT ON COLUMN "scheduler_task"."export_type" IS 'Тип выгрузки'; COMMENT ON COLUMN "scheduler_task"."file_url" IS 'URL файла'`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD CONSTRAINT "FK_e336612c1ac7fbf06159a047622" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`COMMENT ON TABLE "scheduler_task" IS 'История выгрузок в файлы'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP CONSTRAINT "FK_e336612c1ac7fbf06159a047622"`);
    await queryRunner.query(`DROP TABLE "scheduler_task"`);
  }
}
