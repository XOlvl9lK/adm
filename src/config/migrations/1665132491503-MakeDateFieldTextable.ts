/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDateFieldTextable1665132491503 implements MigrationInterface {
  name = 'MakeDateFieldTextable1665132491503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "create_date" TYPE text USING replace("create_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "update_date" TYPE text USING replace("update_date"::text || ':00', ' ', 'T')`,
    );

    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "create_date" TYPE text USING replace("create_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "update_date" TYPE text USING replace("update_date"::text || ':00', ' ', 'T')`,
    );

    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ALTER COLUMN "create_date" TYPE text USING replace("create_date"::text || ':00', ' ', 'T') `,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ALTER COLUMN "update_date" TYPE text USING replace("update_date"::text || ':00', ' ', 'T')`,
    );

    await queryRunner.query(
      `ALTER TABLE "smev_task" ALTER COLUMN "create_date" TYPE text USING replace("create_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "smev_task" ALTER COLUMN "update_date" TYPE text USING replace("update_date"::text || ':00', ' ', 'T')`,
    );

    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ALTER COLUMN "create_date" TYPE text USING replace("create_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ALTER COLUMN "update_date" TYPE text USING replace("update_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ALTER COLUMN "start_date" TYPE text USING  replace("start_date"::text || ':00', ' ', 'T')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ALTER COLUMN "planned_start_date" TYPE text USING replace("planned_start_date"::text || ':00', ' ', 'T')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."start_date" IS 'Дата начала'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ADD "start_date" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."planned_start_date" IS 'Запланированная дата начала'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "planned_start_date"`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ADD "planned_start_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "scheduler_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."last_used_date" IS 'Дата последней выгрузки'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "last_used_date"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "last_used_date" TIMESTAMP`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }
}
