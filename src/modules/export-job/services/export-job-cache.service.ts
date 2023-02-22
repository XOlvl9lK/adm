import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportJobCacheService {
  private cache = new Set<string>();
  private _lastToken = '';

  public onCreate(jobId: string, token: string) {
    this.cache.add(jobId);
    this._lastToken = token;
  }

  public onUpdate(jobId: string, token: string) {
    this.cache.delete(jobId);
    this._lastToken = token;
  }

  public get array() {
    return Array.from(this.cache);
  }

  public get lastToken() {
    return this._lastToken;
  }
}
