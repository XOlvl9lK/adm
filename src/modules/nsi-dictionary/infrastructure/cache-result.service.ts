import {
  ICacheService,
  NsiCache,
  NsiCacheKey,
  NsiCacheValue,
} from '@modules/nsi-dictionary/infrastructure/cache.service.interface';

export abstract class CacheResultService implements ICacheService {
  private cache = new Map<NsiCacheKey, NsiCacheValue[]>();
  private lastCleanDatetime = Date.now();

  setCacheValue({ key, value }: NsiCache) {
    this.cache.set(key, value);
  }

  getCacheValue<T extends NsiCacheValue>(key: NsiCacheKey) {
    return this.cache.get(key) as T[];
  }

  protected updateLastCleanDate() {
    this.lastCleanDatetime = Date.now();
  }

  get lastCleanDate() {
    return this.lastCleanDatetime;
  }

  protected clearCache() {
    this.cache.clear();
  }
}
