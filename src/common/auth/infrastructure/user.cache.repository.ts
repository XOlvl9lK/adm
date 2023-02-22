import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UserCacheRepository {
  private cache: Map<string, User> = new Map();

  setUser(token: string, user: User) {
    this.cache.set(token, user);
  }

  getUser(token: string): User | undefined {
    return this.cache.get(token);
  }
}
