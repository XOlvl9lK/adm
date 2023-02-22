import { Module } from '@nestjs/common';
import { NsiChangeController } from './controllers/nsi-change.controller';
import { NsiChangeElasticRepo } from './infrastructure/nsi-change.elastic-repo';
import { ExportNsiChangeService } from './services/export-nsi-change.service';
import { FindNsiChangeService } from './services/find-nsi-change.service';

@Module({
  controllers: [NsiChangeController],
  providers: [NsiChangeElasticRepo, FindNsiChangeService, ExportNsiChangeService],
})
export class NsiChangeModule {}
