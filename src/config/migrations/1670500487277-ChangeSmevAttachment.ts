import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeSmevAttachment1670500487277 implements MigrationInterface {
    name = 'ChangeSmevAttachment1670500487277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "smev_attachment" ADD "file_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "smev_attachment" ADD "mime_type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "smev_attachment" DROP COLUMN "mime_type"`);
        await queryRunner.query(`ALTER TABLE "smev_attachment" DROP COLUMN "file_name"`);
    }

}
