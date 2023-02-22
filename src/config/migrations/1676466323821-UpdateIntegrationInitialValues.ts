import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateIntegrationInitialValues1676466323821 implements MigrationInterface {
    name = 'UpdateIntegrationInitialValues1676466323821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":["1-ЕГС","2-ЕГС","3-ЕГС","4-ЕГС","1-КОРР","1-Е","1-ЕМ","2-Е","1-Э"],"loadKuspPackages":true,"loadStatisticalCards":true}'`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":["1-ЕГС","2-ЕГС","3-ЕГС","4-ЕГС","1-КОРР","1-Е","1-ЕМ","2-Е","1-Э"],"loadKuspPackages":true,"loadStatisticalCards":true}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "smev_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"loadKuspPackages":true,"loadStatisticalCards":true}'`);
        await queryRunner.query(`ALTER TABLE "integration" ALTER COLUMN "spv_filter" SET DEFAULT '{"unloadDpuAndKuspArrays":true,"onlyDepartments":[],"onlyArraysOfDpuAndKusp":[],"unloadStatisticalReports":true,"onlyStatisticalReports":[],"loadKuspPackages":true,"loadStatisticalCards":true}'`);
    }

}
