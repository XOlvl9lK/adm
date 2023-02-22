import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { BaseHttpTransport } from '@common/base/http.transport.base';
import { ExportJobStatusEnum } from '@modules/export-job/domain/export-job';
import { CreateJobResponse } from '@modules/export-job/infrastructure/create-job.response';
import { ExportJobException } from '@modules/export-job/infrastructure/export-job.exception';
import { ConfigService } from '@nestjs/config';
import { ExportJobCacheService } from '@modules/export-job/services/export-job-cache.service';

type UpdateJobProps = {
  token: string;
  jobId: string;
  status: ExportJobStatusEnum;
  link?: string;
  error?: string;
};

@Injectable()
export class UpdateExportJobService extends BaseHttpTransport implements BeforeApplicationShutdown {
  constructor(configService: ConfigService, private exportJobCacheService: ExportJobCacheService) {
    super({ baseURL: configService.get('DIB_URL') });
  }

  async update({ jobId, link, status, token, error }: UpdateJobProps) {
    const { data } = await this.request<CreateJobResponse>({
      method: 'PUT',
      url: `job-service/jobs/${jobId}`,
      headers: { authorization: `Bearer ${token}` },
      data: {
        link,
        status,
        error,
      },
    });
    if (!data.ok) ExportJobException.UpdateError();
    this.exportJobCacheService.onUpdate(data.data.id, token);
    return data.data;
  }

  async beforeApplicationShutdown() {
    try {
      if (this.exportJobCacheService.lastToken) {
        const jobIds = this.exportJobCacheService.array;
        for (let i = 0; i < jobIds.length; i++) {
          await this.update({
            jobId: jobIds[i],
            token: this.exportJobCacheService.lastToken,
            status: ExportJobStatusEnum.ERROR,
            error: 'Сервер остановлен',
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
