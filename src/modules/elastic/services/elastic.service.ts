import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticService {
  public readonly client!: Client;

  constructor(configService: ConfigService) {
    // const host = configService.get<string>('ELASTICSEARCH_HOST');
    // const port = configService.get<number>('ELASTICSEARCH_PORT');
    // const username = configService.get<string>('ELASTICSEARCH_USERNAME');
    // const password = configService.get<string>('ELASTICSEARCH_PASSWORD');
    // this.client = new Client({
    //   node: `${host}:${port}`,
    //   auth: { username, password },
    // });
  }
}
