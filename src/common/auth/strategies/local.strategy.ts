import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { GetUserService } from '../services/get-user.service';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  name = 'local';

  constructor(private getUserService: GetUserService) {
    super();
  }

  authenticate(request: Request) {
    const token = request.headers.authorization;
    const user = this.getUserService.handle(token);
    request.user = user;
    if (user) this.success(user);
    else this.error(new UnauthorizedException('Пользователь не авторизован.'));
  }
}
