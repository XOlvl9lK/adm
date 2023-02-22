import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const archiver = require('archiver');
import stream from 'stream';
import { Archiver } from 'archiver';

export interface ArchiveData {
  source: stream.Readable | Buffer | string;
  fileName: string;
}

@Injectable()
export class ArchiverService {
  private readonly format = 'zip';

  async zip(...data: ArchiveData[]): Promise<Archiver> {
    const archive = archiver(this.format, { zlib: { level: 5 } });
    data.forEach(({ source, fileName }) => {
      archive.append(source, { name: fileName });
    });
    await archive.finalize();
    return archive;
  }
}
