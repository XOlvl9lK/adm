import { Module } from '@nestjs/common';
import { JournalUserEventsElasticRepo } from './infrastructure/journal-user-events.elastic-repo';
import { JournalUserEventsController } from './controllers/journal-user-events.controller';
import { FindJournalUserEventsService } from './services/find-journal-user-events.service';
import { ExportJournalUserEventsService } from './services/export-journal-user-events.service';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { LogUserEventService } from './services/log-user-event.service';
import { UserPerformedActionService } from './services/user-performed-action.service';

@Module({
  imports: [KafkaModule],
  providers: [
    JournalUserEventsElasticRepo,
    FindJournalUserEventsService,
    ExportJournalUserEventsService,
    LogUserEventService,
    UserPerformedActionService,
  ],
  controllers: [JournalUserEventsController],
})
export class JournalUserEventsModule {}
