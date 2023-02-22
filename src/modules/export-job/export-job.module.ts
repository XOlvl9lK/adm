import { Global, Module } from '@nestjs/common';
import { CreateExportJobService } from '@modules/export-job/services/create-export-job.service';
import { UpdateExportJobService } from '@modules/export-job/services/update-export-job.service';
import { ExportJobCacheService } from '@modules/export-job/services/export-job-cache.service';
import { ExportJobController } from '@modules/export-job/controllers/export-job.controller';
import { DownloadExportJobService } from '@modules/export-job/services/download-export-job.service';
import { MinioModule } from '@modules/minio/minio.module';

@Global()
@Module({
  controllers: [ExportJobController],
  providers: [CreateExportJobService, UpdateExportJobService, ExportJobCacheService, DownloadExportJobService],
  exports: [CreateExportJobService, UpdateExportJobService],
  imports: [MinioModule],
})
export class ExportJobModule {}
