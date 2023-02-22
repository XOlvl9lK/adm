import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSmevAttachmentEntity1670417356140 implements MigrationInterface {
    name = 'AddSmevAttachmentEntity1670417356140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."smev_attachment_type_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TABLE "smev_attachment" ("id" SERIAL NOT NULL, "create_date" text NOT NULL DEFAULT now(), "update_date" text NOT NULL DEFAULT now(), "type" "public"."smev_attachment_type_enum" NOT NULL, "smev_uuid" character varying NOT NULL, "minio_path" character varying NOT NULL, "smev_task_id" integer, CONSTRAINT "PK_2332e02d7849eb9ed2b28c07f2d" PRIMARY KEY ("id")); COMMENT ON COLUMN "smev_attachment"."id" IS 'ID Сущности'; COMMENT ON COLUMN "smev_attachment"."create_date" IS 'Дата и время создания сущности'; COMMENT ON COLUMN "smev_attachment"."update_date" IS 'Дата и время последнего обновления сущности'; COMMENT ON COLUMN "smev_attachment"."smev_task_id" IS 'ID Сущности'`);
        await queryRunner.query(`ALTER TABLE "smev_attachment" ADD CONSTRAINT "FK_0a5e87da61263beacf3aa27a9a2" FOREIGN KEY ("smev_task_id") REFERENCES "smev_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "smev_attachment" DROP CONSTRAINT "FK_0a5e87da61263beacf3aa27a9a2"`);
        await queryRunner.query(`DROP TABLE "smev_attachment"`);
        await queryRunner.query(`DROP TYPE "public"."smev_attachment_type_enum"`);
    }

}
