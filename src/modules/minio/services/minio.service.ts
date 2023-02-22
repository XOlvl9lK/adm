import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ItemBucketMetadata } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const endPoint = this.configService.get('MINIO_END_POINT');
    const port = +this.configService.get('MINIO_PORT');
    const accessKey = this.configService.get('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get('MINIO_SECRET_KEY');
    const bucket = this.configService.get('MINIO_BUCKET');
    if (endPoint && port && accessKey && secretKey && bucket) {
      this.minioClient = new Client({
        endPoint,
        port,
        useSSL: false,
        accessKey,
        secretKey,
      });
      this.bucketName = bucket;
    }
  }

  public uploadFile(fileName: string, path: string, metadata: ItemBucketMetadata = {}) {
    if (!this.minioClient) throw new HttpException('Minio properties not specified', HttpStatus.INTERNAL_SERVER_ERROR);
    return this.minioClient.fPutObject(this.bucketName, fileName, path, metadata);
  }

  public download(fileName: string) {
    if (!this.minioClient) throw new HttpException('Minio properties not specified', HttpStatus.INTERNAL_SERVER_ERROR);
    return this.minioClient.getObject(this.bucketName, fileName);
  }
}
