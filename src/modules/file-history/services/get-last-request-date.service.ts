import { Injectable } from '@nestjs/common';
import { FileHistoryElasticRepo } from '../infrastructure/file-history.elastic-repo';

export interface GetLastRequestDate {
  departmentTitle: string;
  divisionTitle?: string;
}

@Injectable()
export class GetLastRequestDateService {
  constructor(private fileHistoryElasticRepo: FileHistoryElasticRepo) {}

  async handle({ departmentTitle, divisionTitle }: GetLastRequestDate) {
    const result = await this.fileHistoryElasticRepo.getLastRequestDate(departmentTitle, divisionTitle);
    return { Date: result };
  }
}
