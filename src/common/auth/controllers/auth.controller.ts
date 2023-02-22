import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CacheUserService } from '../services/cache-user.service';

@Controller('auth')
export class AuthController {
  constructor(private cacheUserService: CacheUserService) {}

  @Post('user/cache')
  async userAuthenticated(@Req() request: Request) {
    const token = request.headers.authorization;
    const ip = request.ip.split(':').pop();
    return await this.cacheUserService.handle(token, ip);
  }
}
