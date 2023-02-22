import { Module } from '@nestjs/common';
import { JournalErrorsElasticRepo } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo';
import { JournalErrorsController } from '@modules/journal-errors/controllers/journal-errors.controller';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { ExportJournalErrorsService } from '@modules/journal-errors/services/export-journal-errors.service';
import { ErrorCapturedService } from './services/error-captured.service';
import { KafkaModule } from '@modules/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [JournalErrorsElasticRepo, FindJournalErrorsService, ExportJournalErrorsService, ErrorCapturedService],
  controllers: [JournalErrorsController],
})
export class JournalErrorsModule {}
