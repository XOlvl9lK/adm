/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmevHistory1660566989096 implements MigrationInterface {
  name = 'SmevHistory1660566989096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "smev_task" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "update_date" TIMESTAMP NOT NULL DEFAULT now(), "state" text NOT NULL, "task_uuid" character varying NOT NULL, "method_name" character varying NOT NULL, "reply_to" character varying NOT NULL, "get_task_request" character varying NOT NULL, "get_task_response" character varying NOT NULL, "ack_request" character varying, "ack_response" character varying, "send_task_request" character varying, "send_task_response" character varying, "error_description" character varying, "error" character varying, "integration_id" integer, CONSTRAINT "PK_9a2106bb748e2c4999ad5118953" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD CONSTRAINT "FK_a944f0cfea677ff136d05444c4a" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" DROP CONSTRAINT "FK_a944f0cfea677ff136d05444c4a"`);
    await queryRunner.query(`DROP TABLE "smev_task"`);
  }
}
