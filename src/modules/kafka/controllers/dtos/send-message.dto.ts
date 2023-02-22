import { IsArray } from 'class-validator';

export class SendMessageDto {
  @IsArray()
  messages: Message[];
}

export class Message {
  value: {
    [key: string]: any;
  };
}
