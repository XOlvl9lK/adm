import { Injectable } from '@nestjs/common';
import { BaseHttpTransport } from '@common/base/http.transport.base';
import { CreateJobResponse } from '@modules/export-job/infrastructure/create-job.response';
import { ExportJobException } from '@modules/export-job/infrastructure/export-job.exception';
import { ConfigService } from '@nestjs/config';
import { ExportJobCacheService } from '@modules/export-job/services/export-job-cache.service';

@Injectable()
export class CreateExportJobService extends BaseHttpTransport {
  private service = 'adm';

  constructor(configService: ConfigService, private exportJobCacheService: ExportJobCacheService) {
    super({ baseURL: configService.get('DIB_URL') });
  }

  async create(token: string, title: string) {
    const { data } = await this.request<CreateJobResponse>({
      method: 'POST',
      url: `job-service/jobs`,
      headers: { authorization: `Bearer ${token}` },
      data: {
        title,
        service: this.service,
      },
    });
    if (!data.ok) ExportJobException.CreateError();
    this.exportJobCacheService.onCreate(data.data.id, token);
    return data.data;
  }
}
