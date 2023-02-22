import { ElasticModule } from '@modules/elastic/elastic.module';
import { Module } from '@nestjs/common';
import { ExcelModule } from '../excel/excel.module';
import { GetLastRequestDateService } from './services/get-last-request-date.service';
import { FileHistoryController } from './controllers/file-history.controller';
import { FileHistoryElasticRepo } from './infrastructure/file-history.elastic-repo';
import { ExportFileHistoryService } from './services/export-file-history.service';
import { FindAllFileHistoryService } from './services/find-all-file-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHistoryEntity } from './domain/file-history.entity';
import { FindFileHistoryByIdService } from './services/find-file-history-by-id.service';
import { IntegrationModule } from '@modules/integration/integration.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileHistoryEntity]), ElasticModule, ExcelModule, IntegrationModule],
  providers: [
    GetLastRequestDateService,
    FileHistoryElasticRepo,
    ExportFileHistoryService,
    FindAllFileHistoryService,
    FindFileHistoryByIdService,
  ],
  controllers: [FileHistoryController],
})
export class FileHistoryModule {}
