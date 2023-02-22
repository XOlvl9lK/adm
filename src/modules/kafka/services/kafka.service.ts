import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { SendMessageDto } from '../controllers/dtos/send-message.dto';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  // public readonly client: Kafka;
  // private readonly producer: Producer;

  constructor(private readonly configService: ConfigService) {
    // const host = this.configService.get<string>('KAFKA_HOST');
    // const port = this.configService.get<number>('KAFKA_PORT');
    // this.client = new Kafka({
    //   brokers: [`${host}:${port}`],
    // });
    // this.producer = this.client.producer();
  }

  async send(topic: string, { messages }: SendMessageDto) {
    // return await this.producer.send({
    //   topic,
    //   messages: messages.map((m) => ({
    //     ...m,
    //     value: JSON.stringify(m.value),
    //   })),
    // });
  }

  async onModuleInit() {
    // await this.producer.connect();
  }

  async onApplicationShutdown() {
    // await this.producer.disconnect();
  }
}
