import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnName1663248362892 implements MigrationInterface {
  name = 'ChangeColumnName1663248362892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "spvLogin" TO "spv_login"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "spv_login" TO "spvLogin"`);
  }
}
