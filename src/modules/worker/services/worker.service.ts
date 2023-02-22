import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Piscina = require('piscina');

@Injectable()
export class WorkerService {
  private pool = new Piscina({
    filename: resolve(__dirname, '..', 'infrastructure', 'main.worker.js'),
  });

  public run(worker: string, args: any, onSuccess?: (args?: any) => void, onError?: () => void): void {
    this.pool
      .run(args, { name: worker })
      .then((args) => onSuccess?.(args))
      .catch((e) => {
        console.log('Worker error', e);
        onError?.();
      });
  }
}
