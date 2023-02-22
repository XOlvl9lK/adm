/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDefaultValues1661163034547 implements MigrationInterface {
  name = 'UpdateDefaultValues1661163034547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"loadKuspPackages":true,"loadStatisticalCards":true}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"loadKuspPackages":true,"loadStatisticalCards":true}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "file_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"unloadChangesFromLastUnload":true}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"unloadChangesFromLastUnload":true}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"unloadChangesFromLastUnload":true,"onlyDepartments":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "file_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"unloadStatisticalReports":true,"unloadChangesFromLastUnload":true,"archiveAllFilesIntoOneFile":true,"groupFilesByTerritoryBelonging":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReportTypes":[]}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"loadKuspPackages":true,"loadStatisticalCards":true,"disableUpdateDataFromSystem":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET DEFAULT '{"unloadKuspArrays":true,"unloadStatisticalCardArrays":true,"unloadStatisticalReportArrays":true,"loadKuspPackages":true,"loadStatisticalCards":true,"disableUpdateDataFromSystem":false,"onlyDepartments":[],"onlyRegions":[],"onlyArticles":[],"onlyStatisticalCardForms":[],"onlyStatisticalReports":[]}'`,
    );
  }
}
