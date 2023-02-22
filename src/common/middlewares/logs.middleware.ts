import { LoggerService } from '@common/logger/logger.service';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private logger = new LoggerService();

  use(req: any, res: Response, next: () => void) {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;

      const logMessage = `${method} ${originalUrl} Status Code: ${statusCode} Status Message: ${statusMessage}`;
      return this.logger.log(logMessage, 'HTTP');
    });

    next();
  }
}
