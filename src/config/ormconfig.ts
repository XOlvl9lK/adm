import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IntegrationEntity } from '@modules/integration/domain/integration/integration.entity';
// eslint-disable-next-line max-len
import { IntegrationDivisionEntity } from '@modules/integration/domain/integration-division/integration-division.entity';
// eslint-disable-next-line max-len
import { IntegrationCommonSettingEntity } from '@modules/integration-common-setting/domain/integration-common-setting.entity';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { FileHistoryEntity } from '@modules/file-history/domain/file-history.entity';
import { SmevAttachmentEntity } from '@modules/smev-attachment/domain/smev-attachment.entity';

export const ormEntities = [
  IntegrationEntity,
  IntegrationDivisionEntity,
  IntegrationCommonSettingEntity,
  SmevHistoryEntity,
  FileHistoryEntity,
  SmevAttachmentEntity,
];

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: ['error', 'warn', 'migration', 'schema'],
  entities: ormEntities,
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  migrationsTableName: 'db_migration',
  migrations: ['dist/config/migrations/**/*{.js, .ts}'],
  cli: {
    migrationsDir: 'src/config/migrations',
  },
};

export default TypeOrmConfig;
