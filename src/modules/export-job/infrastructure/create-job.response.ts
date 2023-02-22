import { ExportJob } from '@modules/export-job/domain/export-job';

export type CreateJobResponse = {
  ok: boolean;
  data: ExportJob;
};
