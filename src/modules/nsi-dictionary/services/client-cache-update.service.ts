import { Injectable } from '@nestjs/common';
import {
  CACHE_UPDATED_EVENT,
  NsiDictionaryRequestService,
} from '@modules/nsi-dictionary/services/nsi-dictionary-request.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

@Injectable()
export class ClientCacheUpdateService {
  private updatesNeeded = JSON.stringify({ updatesNeeded: true });

  constructor(private requests: NsiDictionaryRequestService, private eventEmitter: EventEmitter2) {}

  async subscribeToCacheUpdate(response: Response, timestamp?: number) {
    response.writeHead(200, {
      // eslint-disable-next-line prettier/prettier
      Connection: 'keep-alive',
      'Content-type': 'text/event-stream',
      'Cache-control': 'no-cache',
    });

    if (!timestamp || timestamp < this.requests.lastCleanDate) {
      return response.write(`data: ${this.updatesNeeded} \n\n`);
    }

    this.eventEmitter.on(CACHE_UPDATED_EVENT, () => {
      response.write(`data: ${this.updatesNeeded} \n\n`);
    });
  }
}
