import { Module } from '@nestjs/common';
import { SpvHistoryController } from './controllers/spv-history.controller';
import { ExcelModule } from '../excel/excel.module';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { ElasticModule } from '@modules/elastic/elastic.module';
import { CreateSpvHistoryService } from './services/create-spv-history.service';
import { GetLastSpvRequestNumber } from './services/get-last-spv-request-number.service';
import { SpvHistoryElasticRepo } from './infrastructure/spv-history.elastic-repo';
import { FindSpvHistoryService } from './services/find-spv-history.service';
import { ExportSpvHistoryService } from './services/export-spv-history.service';

@Module({
  imports: [KafkaModule, ElasticModule, ExcelModule],
  controllers: [SpvHistoryController],
  providers: [
    FindSpvHistoryService,
    ExportSpvHistoryService,
    CreateSpvHistoryService,
    GetLastSpvRequestNumber,
    SpvHistoryElasticRepo,
  ],
  exports: [
    FindSpvHistoryService,
    ExportSpvHistoryService,
    CreateSpvHistoryService,
    GetLastSpvRequestNumber,
    SpvHistoryElasticRepo,
  ],
})
export class SpvHistoryModule {}
