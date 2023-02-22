import { Global, Module } from '@nestjs/common';
import { ElasticService } from './services/elastic.service';
import { ElasticMigrationService } from './services/elastic-migration.service';

@Global()
@Module({
  providers: [ElasticService, ElasticMigrationService],
  exports: [ElasticService],
})
export class ElasticModule {}
