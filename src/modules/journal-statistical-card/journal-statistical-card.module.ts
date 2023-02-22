import { Module } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalStatisticalCardController } from '@modules/journal-statistical-card/controllers/journal-statistical-card.controller';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardService } from '@modules/journal-statistical-card/services/export-journal-statistical-card.service';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
import { ExportStatusHistoryService } from '@modules/journal-statistical-card/services/export-status-history.service';
import { ExportErrorInfoService } from '@modules/journal-statistical-card/services/export-error-info.service';

@Module({
  controllers: [JournalStatisticalCardController],
  providers: [
    FindJournalStatisticalCardService,
    ExportJournalStatisticalCardService,
    JournalStatisticalCardElasticRepo,
    ExportStatusHistoryService,
    ExportErrorInfoService,
  ],
})
export class JournalStatisticalCardModule {}
