import { Module } from '@nestjs/common';
import { TypicalViolationsController } from './controllers/typical-violations.controller';
import { TypicalViolationsElasticRepo } from './infrastructure/typical-violations.elastic-repo';
import { FindTypicalViolationService } from './services/find-typical-violation.service';
import { ExportTypicalViolationService } from './services/export-typical-violation.service';

@Module({
  providers: [TypicalViolationsElasticRepo, FindTypicalViolationService, ExportTypicalViolationService],
  controllers: [TypicalViolationsController],
})
export class JournalTypicalViolationsModule {}
