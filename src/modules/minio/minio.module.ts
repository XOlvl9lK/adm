import { Module } from '@nestjs/common';
import { MinioService } from '@modules/minio/services/minio.service';
import { MinioController } from '@modules/minio/controllers/minio.controller';

@Module({
  providers: [MinioService],
  exports: [MinioService],
  controllers: [MinioController],
})
export class MinioModule {}
