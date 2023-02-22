export enum ExportJobStatusEnum {
  PENDING = 'Pending',
  DONE = 'Done',
  ERROR = 'Error',
}

export type ExportJob = {
  id: string;
  title: string;
  service: string;
  userId: string;
  status: ExportJobStatusEnum;
  createdAt: string;
  updatedAt: string;
  link?: string;
  error?: string;
};
