import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegration1660824953331 implements MigrationInterface {
  name = 'UpdateIntegration1660824953331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "divisionId" TYPE integer USING "divisionId"::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "department_id" TYPE integer USING "department_id"::integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "department_id" character varying(200) USING "divisionId"::varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_division" ALTER COLUMN "divisionId" character varying(200) USING "divisionId"::varchar`,
    );
  }
}
