import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSpvLoginProperty1663751013642 implements MigrationInterface {
  name = 'ChangeSpvLoginProperty1663751013642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "spv_login" TO "login"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."login" IS 'Уникальный ключ безопасности запроса СПВ/СМЭВ'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "integration"."login" IS 'Уникальный ключ безопасности запроса'`);
    await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "login" TO "spv_login"`);
  }
}
