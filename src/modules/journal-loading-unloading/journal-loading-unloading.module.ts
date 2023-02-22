import { Module } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingController } from '@modules/journal-loading-unloading/controllers/journal-loading-unloading.controller';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingElasticRepo } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/export-journal-loading-unloading.service';

@Module({
  controllers: [JournalLoadingUnloadingController],
  providers: [
    FindJournalLoadingUnloadingService,
    JournalLoadingUnloadingElasticRepo,
    ExportJournalLoadingUnloadingService,
  ],
})
export class JournalLoadingUnloadingModule {}
