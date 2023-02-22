import { Injectable } from '@nestjs/common';
import { UserCacheRepository } from '../infrastructure/user.cache.repository';

@Injectable()
export class GetUserService {
  constructor(private userCacheRepository: UserCacheRepository) {}

  handle(token: string) {
    return this.userCacheRepository.getUser(token);
  }
}
