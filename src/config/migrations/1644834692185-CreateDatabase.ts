/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1644834692185 implements MigrationInterface {
  name = 'CreateDatabase1644834692185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "integration_catalogue" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "path" character varying NOT NULL, "integration_id" integer, CONSTRAINT "PK_f1143c75d7297afe26aa19c4bbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "request_method" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "method_name" character varying NOT NULL, CONSTRAINT "PK_856a139f4d93f1d6c22294646d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spv_history" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "request_number" character varying NOT NULL, "request_state" character varying NOT NULL DEFAULT 'IN_PROCESS', "start_date" TIMESTAMP NOT NULL, "finish_date" TIMESTAMP, "request_xml_url" character varying NOT NULL, "response_xml_url" character varying, "unique_security_key" character varying NOT NULL, "request_method_id" integer NOT NULL, "integration_id" integer NOT NULL, CONSTRAINT "REL_57a490b5a21feca81db69a67e9" UNIQUE ("request_method_id"), CONSTRAINT "PK_4bf6a8acef452fecd7868014892" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file_history" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "request_state" character varying NOT NULL DEFAULT 'IN_PROCESS', "start_date" TIMESTAMP NOT NULL, "finish_date" TIMESTAMP, "response_file_url" character varying, "request_method_id" integer NOT NULL, "integration_id" integer NOT NULL, CONSTRAINT "REL_64cbc2d843d3404f5405faa1a0" UNIQUE ("request_method_id"), CONSTRAINT "PK_0deb31e450cde5a323d8af4aa3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "smev_history" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "request_number" character varying NOT NULL, "request_state" character varying NOT NULL DEFAULT 'IN_PROCESS', "start_date" TIMESTAMP NOT NULL, "finish_date" TIMESTAMP, "request_xml_url" character varying NOT NULL, "response_xml_url" character varying, "authority_certificate" character varying NOT NULL, "request_method_id" integer NOT NULL, "integration_id" integer NOT NULL, CONSTRAINT "REL_8fc548be02cb67ed8e26d2ba08" UNIQUE ("request_method_id"), CONSTRAINT "PK_556d4d0260552a2c63009de552a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "integration" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "condition" character varying NOT NULL, "unique_external_system_id" character varying, "unique_security_key" character varying, "information_system_key" character varying, "authority_certificate" character varying, "smev_sign" character varying, "smev_connection_data" character varying, "last_used_date" TIMESTAMP, CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "common_setting" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_1ce3b973efa0288a3f7c87e9a87" UNIQUE ("name"), CONSTRAINT "PK_c9d3aac96106765f087af91d38f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration_catalogue" ADD CONSTRAINT "FK_d456fbfc8467faecbb678740a21" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spv_history" ADD CONSTRAINT "FK_57a490b5a21feca81db69a67e94" FOREIGN KEY ("request_method_id") REFERENCES "request_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spv_history" ADD CONSTRAINT "FK_9164aadb9933e0ed27bafc35c13" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_history" ADD CONSTRAINT "FK_64cbc2d843d3404f5405faa1a07" FOREIGN KEY ("request_method_id") REFERENCES "request_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_history" ADD CONSTRAINT "FK_996c493a5ed7eaa71e171cebf68" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "smev_history" ADD CONSTRAINT "FK_8fc548be02cb67ed8e26d2ba087" FOREIGN KEY ("request_method_id") REFERENCES "request_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "smev_history" ADD CONSTRAINT "FK_3f2f265ce735e8e306eb6df9a73" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_history" DROP CONSTRAINT "FK_3f2f265ce735e8e306eb6df9a73"`);
    await queryRunner.query(`ALTER TABLE "smev_history" DROP CONSTRAINT "FK_8fc548be02cb67ed8e26d2ba087"`);
    await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_996c493a5ed7eaa71e171cebf68"`);
    await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_64cbc2d843d3404f5405faa1a07"`);
    await queryRunner.query(`ALTER TABLE "spv_history" DROP CONSTRAINT "FK_9164aadb9933e0ed27bafc35c13"`);
    await queryRunner.query(`ALTER TABLE "spv_history" DROP CONSTRAINT "FK_57a490b5a21feca81db69a67e94"`);
    await queryRunner.query(`ALTER TABLE "integration_catalogue" DROP CONSTRAINT "FK_d456fbfc8467faecbb678740a21"`);
    await queryRunner.query(`DROP TABLE "common_setting"`);
    await queryRunner.query(`DROP TABLE "integration"`);
    await queryRunner.query(`DROP TABLE "smev_history"`);
    await queryRunner.query(`DROP TABLE "file_history"`);
    await queryRunner.query(`DROP TABLE "spv_history"`);
    await queryRunner.query(`DROP TABLE "request_method"`);
    await queryRunner.query(`DROP TABLE "integration_catalogue"`);
  }
}
