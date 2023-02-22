import { Module } from '@nestjs/common';
import { CancellationKuspElasticRepo } from './infrastructure/cancellation-kusp.elastic-repo';
import { FindCancellationKuspService } from './services/find-cancellation-kusp.service';
import { ExportCancellationKuspService } from './services/export-cancellation-kusp.service';
import { CancellationKuspController } from './controllers/cancellation-kusp.controller';

@Module({
  providers: [CancellationKuspElasticRepo, FindCancellationKuspService, ExportCancellationKuspService],
  controllers: [CancellationKuspController],
})
export class JournalCancellationKuspModule {}
