/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultValues1659600310985 implements MigrationInterface {
  name = 'CreateDefaultValues1659600310985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"loadKuspPackages":true,"loadStatisticalCards":true,"disableUpdateDataFromSystem":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"loadKuspPackages":true,"loadStatisticalCards":true,"disableUpdateDataFromSystem":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "file_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"unloadStatisticalReports":true,"unloadChangesFromLastUnload":true,"archiveAllFilesIntoOneFile":true,"groupFilesByTerritoryBelonging":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReportTypes":[]}'`,
    );
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"unloadChangesFromLastUnload":true,"onlyDepartments":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" DROP NOT NULL`);
  }
}
