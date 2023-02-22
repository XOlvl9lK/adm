import { Injectable } from '@nestjs/common';
import { SpvHistoryElasticRepo } from '../infrastructure/spv-history.elastic-repo';

@Injectable()
export class GetLastSpvRequestNumber {
  constructor(private spvRepository: SpvHistoryElasticRepo) {}

  async handle(): Promise<{ lastRequestNumber: number }> {
    return {
      lastRequestNumber: await this.spvRepository.getLastRequestNumber(),
    };
  }
}
