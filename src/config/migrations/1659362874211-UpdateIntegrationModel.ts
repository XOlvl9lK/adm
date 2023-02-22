/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegrationModel1659362874211 implements MigrationInterface {
  name = 'UpdateIntegrationModel1659362874211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM public."integration"');
    await queryRunner.query(
      `CREATE TABLE "integration_division" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "divisionId" character varying NOT NULL, "divisionName" character varying NOT NULL, "path" character varying NOT NULL, "scheduler_dpu_kusp" text NOT NULL, "cron_dpu_kusp" character varying NOT NULL, "scheduler_statistical_report" text NOT NULL, "cron_statistical_report" character varying NOT NULL, "integration_id" integer, CONSTRAINT "PK_82efa412b60b92814d333eb0967" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "unique_external_system_id"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "unique_security_key"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "information_system_key"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "authority_certificate"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "smev_sign"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "smev_connection_data"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "department_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "department_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "spv_external_system_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "spv_unique_security_key" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "smev_mnemonic" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "smev_authority_certificate" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_path" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_scheduler_dpu_kusp" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_cron_dpu_kusp" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_scheduler_statistical_report" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "file_cron_statistical_report" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "manual_export_filter" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."integration_type_enum" AS ENUM('SPV', 'SMEV', 'FILE', 'MANUAL_EXPORT')`,
    );
    await queryRunner.query(`ALTER TABLE "integration" ADD "type" "public"."integration_type_enum" NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "condition"`);
    await queryRunner.query(`CREATE TYPE "public"."integration_condition_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "condition" "public"."integration_condition_enum" NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "last_used_date" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration_division" DROP CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9"`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "last_used_date" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "condition"`);
    await queryRunner.query(`DROP TYPE "public"."integration_condition_enum"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "condition" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."integration_type_enum"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "type" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "manual_export_filter"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_cron_statistical_report"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_scheduler_statistical_report"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_cron_dpu_kusp"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_scheduler_dpu_kusp"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "file_path"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "smev_authority_certificate"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "smev_mnemonic"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "spv_unique_security_key"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "spv_external_system_id"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "department_name"`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "department_id"`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "smev_connection_data" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "smev_sign" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "authority_certificate" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "information_system_key" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "unique_security_key" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "unique_external_system_id" character varying`);
    await queryRunner.query(`ALTER TABLE "integration" ADD "name" character varying NOT NULL`);
    await queryRunner.query(`DROP TABLE "integration_division"`);
  }
}
