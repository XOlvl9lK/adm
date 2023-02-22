import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegrationDivision1664371965603 implements MigrationInterface {
  name = 'AddIntegrationDivision1664371965603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ADD "division_id" integer`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."division_id" IS 'Идентификатор подразделения'`);
    await queryRunner.query(`UPDATE "integration" SET "division_id" = 0 WHERE "division_id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_id" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "integration" ADD "division_name" character varying`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."division_name" IS 'Наименование подразделения'`);
    await queryRunner.query(`UPDATE "integration" SET "division_name" = '' WHERE "division_name" IS NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_name" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "integration"."division_name" IS 'Наименование подразделения'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "division_name"`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."division_id" IS 'Идентификатор подразделения'`);
    await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "division_id"`);
  }
}
