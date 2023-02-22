import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthHttpTransport } from './infrastructure/auth.http.transport';
import { UserCacheRepository } from './infrastructure/user.cache.repository';
import { LocalStrategy } from './strategies/local.strategy';
import { CacheUserService } from './services/cache-user.service';
import { GetUserService } from './services/get-user.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'local' })],
  providers: [AuthHttpTransport, UserCacheRepository, CacheUserService, GetUserService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
