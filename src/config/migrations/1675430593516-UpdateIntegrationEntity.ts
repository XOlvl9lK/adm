import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateIntegrationEntity1675430593516 implements MigrationInterface {
    name = 'UpdateIntegrationEntity1675430593516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":["1-ЕГС","2-ЕГС","3-ЕГС","4-ЕГС","1-КОРР","1-Е","1-ЕМ","2-Е","1-Э"],"unloadChangesFromLastUnload":true}'`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":["1-ЕГС","2-ЕГС","3-ЕГС","4-ЕГС","1-КОРР","1-Е","1-ЕМ","2-Е","1-Э"],"unloadChangesFromLastUnload":true}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "manual_export_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"unloadChangesFromLastUnload":true}'`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "file_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"unloadChangesFromLastUnload":true}'`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "division_id" SET NOT NULL`);
    }

}
