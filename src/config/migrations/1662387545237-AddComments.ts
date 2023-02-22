/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComments1662387545237 implements MigrationInterface {
  name = 'AddComments1662387545237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE public."integration" IS 'Внешние взаимодействия'`);
    await queryRunner.query(`COMMENT ON TABLE public."integration_division" IS 'Подразделения внешних систем'`);
    await queryRunner.query(`COMMENT ON TABLE public."smev_task" IS 'Журнал СМЭВ'`);
    await queryRunner.query(`COMMENT ON TABLE public."integration_common_setting" IS 'Общие настройки компонента'`);
    await queryRunner.query(`ALTER TABLE "integration_division" DROP CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9"`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."id" IS 'ID Сущности'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."divisionId" IS 'ID подразделения'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."divisionName" IS 'Наименование подразделения'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."path" IS 'Каталог выгрузки'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."scheduler_dpu_kusp" IS 'Периодичность выгрузки для ДПУ КУСП (в виде объекта)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."cron_dpu_kusp" IS 'Периодичность выгрузки для ДПУ КУСП (в виде крон строки)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."scheduler_statistical_report" IS 'Периодичность выгрузки для Стат. отчетов (в виде объекта)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_division"."cron_statistical_report" IS 'Периодичность выгрузки для Стат. отчетов (в виде крон строки)'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."integration_id" IS 'ID Сущности'`);
    await queryRunner.query(`ALTER TABLE "smev_task" DROP CONSTRAINT "FK_a944f0cfea677ff136d05444c4a"`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."id" IS 'ID Сущности'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."type" IS 'Тип внешнего взаимодействия'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."condition" IS 'Состояние внешнего взаимодействия'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."department_id" IS 'Идентификатор ведомства'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."department_name" IS 'Наименование ведомства'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_filter" IS 'Фильтр СПВ взаимодействия'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."spv_external_system_id" IS 'Уникальный идентификатор внешней системы, зарегистрированный в ГАС ПС'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."spv_unique_security_key" IS 'Уникальный ключ безопасности запроса'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."smev_filter" IS 'Фильтр СМЭВ взаимодействия'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."smev_mnemonic" IS 'Код информационной системы по унифицированному справочнику мнемоник'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."smev_authority_certificate" IS 'Сертификат электронной подписи органа власти'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_filter" IS 'Фильтр Файлового взаимодействия'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_path" IS 'Каталог выгрузки'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."file_scheduler_dpu_kusp" IS 'Периодичность выгрузки для ДПУ КУСП (в виде объекта)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."file_cron_dpu_kusp" IS 'Периодичность выгрузки для ДПУ КУСП (в виде крон строки)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."file_scheduler_statistical_report" IS 'Периодичность выгрузки для Стат. отчётов (в виде объекта)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."file_cron_statistical_report" IS 'Периодичность выгрузки для Стат. отчётов (в виде крон строки)'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration"."manual_export_filter" IS 'Фильтр взаимодействия для ручной выгрузки'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration"."last_used_date" IS 'Дата последней выгрузки'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_cert" IS 'Оттиск сертификата СПВ взаимодействия'`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."id" IS 'ID Сущности'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."create_date" IS 'Дата и время создания сущности'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."key" IS 'Ключ значения общих настроек компонента'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."value" IS 'Значение поля общих настроек компонента'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."file" IS 'Значение файла сертификата в виде байт-кода общих настроек взаимодействия'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "integration_common_setting"."file_name" IS 'Наименование файла сертификата'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."id" IS 'ID Сущности'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."create_date" IS 'Дата и время создания сущности'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."update_date" IS 'Дата и время последнего обновления сущности'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."state" IS 'Статус запроса'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."task_uuid" IS 'Идентификатор задачи'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."method_name" IS 'Тип запроса'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."reply_to" IS 'Адресат'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."get_task_request" IS 'Получение задачи. XML запроса'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."get_task_response" IS 'Получение задачи. XML ответа'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."ack_request" IS 'Подтверждение получения задачи. XML запроса'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."ack_response" IS 'Подтверждение получения задачи. XML ответа'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."send_task_request_with_signature" IS 'Решение задачи. XML запроса с подписью'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "smev_task"."send_task_request_without_signature" IS 'Решение задачи. XML ответа без подписи'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error_description" IS 'Решение задачи. XML ответа'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error" IS 'Код ошибки'`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."integration_id" IS 'ID Сущности'`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD CONSTRAINT "FK_a944f0cfea677ff136d05444c4a" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "smev_task" DROP CONSTRAINT "FK_a944f0cfea677ff136d05444c4a"`);
    await queryRunner.query(`ALTER TABLE "integration_division" DROP CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9"`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."integration_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."error_description" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."send_task_request_without_signature" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."send_task_request_with_signature" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."ack_response" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."ack_request" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."get_task_response" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."get_task_request" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."reply_to" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."method_name" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."task_uuid" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."state" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."update_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."create_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "smev_task"."id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."file_name" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."file" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."value" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."key" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."update_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."create_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_common_setting"."id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_cert" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."last_used_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."manual_export_filter" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_cron_statistical_report" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_scheduler_statistical_report" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_cron_dpu_kusp" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_scheduler_dpu_kusp" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_path" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."file_filter" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."smev_authority_certificate" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."smev_mnemonic" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."smev_filter" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_unique_security_key" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_external_system_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."spv_filter" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."department_name" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."department_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."condition" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."type" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."update_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."create_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration"."id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "smev_task" ADD CONSTRAINT "FK_a944f0cfea677ff136d05444c4a" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."integration_id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."cron_statistical_report" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."scheduler_statistical_report" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."cron_dpu_kusp" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."scheduler_dpu_kusp" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."path" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."divisionName" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."divisionId" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."update_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."create_date" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "integration_division"."id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "integration_division" ADD CONSTRAINT "FK_b4747f266c4f2e5844fd2ed84c9" FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
