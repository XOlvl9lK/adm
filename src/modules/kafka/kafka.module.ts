import { Module } from '@nestjs/common';
import { KafkaService } from './services/kafka.service';
import { KafkaController } from './controllers/kafka.controller';

@Module({
  providers: [KafkaService],
  controllers: [KafkaController],
  exports: [KafkaService],
})
export class KafkaModule {}
