import {
  ICacheService,
  NsiCache,
  NsiCacheKey,
  NsiCacheValue,
} from '@modules/nsi-dictionary/infrastructure/cache.service.interface';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, WriteFileOptions, writeFileSync } from 'fs';

export class LocalCacheService implements ICacheService {
  private readonly cachePath = join(process.cwd(), 'cache');
  private readonly fileNames: NsiCacheKey[] = [
    'region',
    'subdivision',
    'prosecutorOffice',
    'department',
    'responseMeasure',
  ];
  private lastCleanDatetime = Date.now();
  private readonly options: WriteFileOptions = { encoding: 'utf-8' };

  constructor() {
    this.fileNames.forEach((fileName) => {
      const file = this.getFilePath(fileName);
      if (!existsSync(file)) {
        writeFileSync(file, '', this.options);
      }
    });
  }

  getCacheValue<T extends NsiCacheValue>(key: NsiCacheKey): T[] {
    const file = this.getFilePath(key);
    if (!existsSync(file)) return [];
    const data = readFileSync(file, this.options) as string;
    return JSON.parse(data || '[]');
  }

  setCacheValue({ key, value }: NsiCache): void {
    const file = this.getFilePath(key);
    writeFileSync(file, JSON.stringify(value));
  }

  protected updateLastCleanDate(): void {
    this.lastCleanDatetime = Date.now();
  }

  get lastCleanDate(): number {
    return this.lastCleanDatetime;
  }

  private getFilePath(fileName: NsiCacheKey) {
    return join(this.cachePath, fileName + '.cache');
  }

  protected clearCache() {
    this.fileNames.forEach((fileName) => {
      const file = this.getFilePath(fileName);
      unlinkSync(file);
    });
  }
}
