import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('minio')
export class MinioController {
  constructor(private configService: ConfigService) {}

  @Get('is-properties-specified')
  isMinioPropertiesSpecified() {
    const endPoint = this.configService.get('MINIO_END_POINT');
    const port = +this.configService.get('MINIO_PORT');
    const accessKey = this.configService.get('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get('MINIO_SECRET_KEY');
    const bucket = this.configService.get('MINIO_BUCKET');
    return {
      isPropertiesSpecified: Boolean(endPoint && port && accessKey && secretKey && bucket)
    }
  }
}