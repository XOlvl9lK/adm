/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConditionType1662363436777 implements MigrationInterface {
  name = 'AddConditionType1662363436777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."integration_condition_enum" RENAME TO "integration_condition_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."integration_condition_enum" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "condition" TYPE "public"."integration_condition_enum" USING "condition"::"text"::"public"."integration_condition_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."integration_condition_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."integration_condition_enum_old" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "condition" TYPE "public"."integration_condition_enum_old" USING "condition"::"text"::"public"."integration_condition_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."integration_condition_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."integration_condition_enum_old" RENAME TO "integration_condition_enum"`,
    );
  }
}
