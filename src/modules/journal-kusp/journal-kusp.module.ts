import { Module } from '@nestjs/common';
import { JournalKuspController } from '@modules/journal-kusp/controllers/journal-kusp.controller';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';
import { ExportJournalKuspService } from '@modules/journal-kusp/services/export-journal-kusp.service';
import { ExportErrorInfoService } from '@modules/journal-kusp/services/export-error-info.service';
import { GetKuspFileService } from './services/get-kusp-file.service';

@Module({
  controllers: [JournalKuspController],
  providers: [
    FindJournalKuspService,
    JournalKuspElasticRepo,
    ExportJournalKuspService,
    ExportErrorInfoService,
    GetKuspFileService,
  ],
})
export class JournalKuspModule {}
