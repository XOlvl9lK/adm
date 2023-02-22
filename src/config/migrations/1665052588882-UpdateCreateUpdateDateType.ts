import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCreateUpdateDateType1665052588882 implements MigrationInterface {
  name = 'UpdateCreateUpdateDateType1665052588882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "scheduler_task" ADD "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scheduler_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "scheduler_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "update_date"`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ADD "update_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`COMMENT ON COLUMN "scheduler_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" DROP COLUMN "create_date"`);
    await queryRunner.query(`ALTER TABLE "scheduler_task" ADD "create_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "update_date"`);
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "update_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP COLUMN "create_date"`);
    await queryRunner.query(`ALTER TABLE "smev_task" ADD "create_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "update_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "update_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_common_setting" DROP COLUMN "create_date"`);
    await queryRunner.query(
      `ALTER TABLE "integration_common_setting" ADD "create_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "update_date"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "update_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "create_date"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "create_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "update_date"`);
    await queryRunner.query(`ALTER TABLE "integration_division" ADD "update_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(`ALTER TABLE "integration_division" DROP COLUMN "create_date"`);
    await queryRunner.query(`ALTER TABLE "integration_division" ADD "create_date" TIMESTAMP NOT NULL DEFAULT now()`);
  }
}
