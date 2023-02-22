import { Injectable } from '@nestjs/common';
import { SpvHistoryEntity } from '../domain/spv-history.entity';
import { KafkaService } from '@modules/kafka/services/kafka.service';

@Injectable()
export class CreateSpvHistoryService {
  constructor(private kafkaService: KafkaService) {}

  async handle(entity: SpvHistoryEntity): Promise<void> {
    await this.kafkaService.send('journal-spv-history', {
      messages: [{ value: entity }],
    });
  }
}
