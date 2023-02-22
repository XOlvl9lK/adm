import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@config/ormconfig';
import { IntegrationModule } from '@modules/integration/integration.module';
import { LogsMiddleware } from '@common/middlewares/logs.middleware';
import { SpvHistoryModule } from '@modules/spv-history/spv-history.module';
import { ExcelModule } from '@modules/excel/excel.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { JournalUserEventsModule } from '@modules/journal-user-event/journal-user-events.module';
import { ElasticModule } from '@modules/elastic/elastic.module';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { JournalErrorsModule } from '@modules/journal-errors/journal-errors.module';
import { ArchiverModule } from '@modules/archiver/archiver.module';
import { XmlModule } from '@modules/xml/xml.module';
import { JournalKuspModule } from '@modules/journal-kusp/journal-kusp.module';
import { NsiChangeModule } from '@modules/journal-nsi-change/nsi-change.module';
import { JournalLoadingUnloadingModule } from '@modules/journal-loading-unloading/journal-loading-unloading.module';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardModule } from '@modules/journal-cancellation-statistical-card/journal-cancellation-statistical-card.module';
import { JournalTypicalViolationsModule } from '@modules/journal-typical-violation/journal-typical-violations.module';
import { JournalCancellationKuspModule } from '@modules/journal-cancellation-kusp/journal-cancellation-kusp.module';
// eslint-disable-next-line max-len
import { JournalCancellationRecordCardModule } from '@modules/journal-cancellation-record-card/journal-cancellation-record-card.module';
import { JournalStatisticalCardModule } from '@modules/journal-statistical-card/journal-statistical-card.module';
import { NsiDictionaryModule } from '@modules/nsi-dictionary/nsi-dictionary.module';
import { FileHistoryModule } from '@modules/file-history/file-history.module';
import { IntegrationCommonSettingModule } from '@modules/integration-common-setting/integration-common-setting.module';
import { SmevHistoryModule } from '@modules/smev-history/smev-history.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '@common/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorLoggingInterceptor } from '@modules/journal-errors/infrastructure/interceptors/error-logging.interceptor';
import { LoggerModule } from '@common/logger/logger.module';
import { ExportJobModule } from './modules/export-job/export-job.module';
import { WorkerModule } from './modules/worker/worker.module';
import { MinioModule } from './modules/minio/minio.module';
import { AppController } from 'src/app.controller';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const isDev = NODE_ENV === 'development';
const devEnvironment = join(process.cwd(), '.env.dev');

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !isDev,
      ...(isDev && { envFilePath: devEnvironment }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...TypeOrmConfig,
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
      }),
    }),
    AuthModule,
    ExcelModule,
    IntegrationModule,
    IntegrationCommonSettingModule,
    SpvHistoryModule,
    FileHistoryModule,
    JournalUserEventsModule,
    ElasticModule,
    KafkaModule,
    JournalErrorsModule,
    ArchiverModule,
    XmlModule,
    JournalKuspModule,
    NsiChangeModule,
    JournalLoadingUnloadingModule,
    JournalCancellationStatisticalCardModule,
    JournalTypicalViolationsModule,
    JournalCancellationKuspModule,
    JournalCancellationRecordCardModule,
    JournalStatisticalCardModule,
    NsiDictionaryModule,
    SmevHistoryModule,
    EventEmitterModule.forRoot(),
    ExportJobModule,
    WorkerModule,
    MinioModule,
  ],
  providers: [
    ElasticService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
