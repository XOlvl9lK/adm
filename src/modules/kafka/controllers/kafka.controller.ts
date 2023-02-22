import { Body, Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { KafkaService } from '../services/kafka.service';
import { SendMessageDto } from './dtos/send-message.dto';

@Controller('kafka')
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}

  @Post(':topic')
  async send(@Param('topic') topic: string, @Body() messageDto: SendMessageDto) {
    // const res = await this.kafkaService.send(topic, messageDto);
    // if (!res || !res.length) {
    //   throw new HttpException('Ошибка отправки сообщения в Kafka', HttpStatus.BAD_REQUEST);
    // }
    // return res;
    return { success: true }
  }

  @Post('fake/:topic')
  async fakeSend() {
    return { success: true }
  }
}
