import { Module } from '@nestjs/common';
import { CancellationRecordCardElasticRepo } from './infrastructure/cancellation-record-card.elastic-repo';
import { FindCancellationRecordCardService } from './services/find-cancellation-record-card.service';
import { ExportCancellationRecordCardService } from './services/export-cancellation-record-card.service';
import { CancellationRecordCardController } from './controllers/cancellation-record-card.controller';

@Module({
  providers: [
    CancellationRecordCardElasticRepo,
    FindCancellationRecordCardService,
    ExportCancellationRecordCardService,
  ],
  controllers: [CancellationRecordCardController],
})
export class JournalCancellationRecordCardModule {}
