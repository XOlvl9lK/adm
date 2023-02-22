import { Injectable } from '@nestjs/common';
import { MinioService } from '@modules/minio/services/minio.service';

@Injectable()
export class DownloadExportJobService {
  constructor(private minioService: MinioService) {}

  download(fileName: string) {
    return this.minioService.download(`exports/${fileName}`);
  }
}
