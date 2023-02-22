import { Module } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardController } from '@modules/journal-cancellation-statistical-card/controllers/journal-cancellation-statistical-card.controller';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/export-journal-cancellation-statistical-card.service';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardElasticRepo } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo';

@Module({
  controllers: [JournalCancellationStatisticalCardController],
  providers: [
    ExportJournalCancellationStatisticalCardService,
    FindJournalCancellationStatisticalCardService,
    JournalCancellationStatisticalCardElasticRepo,
  ],
})
export class JournalCancellationStatisticalCardModule {}
