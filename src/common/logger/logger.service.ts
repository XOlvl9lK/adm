import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFileSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';

const logFile = process.env.APP_LOG_PATH || join(process.cwd(), 'logs', 'administration-backend.log');

@Injectable()
export class LoggerService extends ConsoleLogger {
  public static file = logFile;

  log(message: any, ...params: [...any, string?]): void {
    const context = this.context || params.pop();
    appendFileSync(
      LoggerService.file,
      EOL +
        JSON.stringify({
          date: new Date().toISOString(),
          type: 'LOG',
          context,
          message,
          params,
        }),
    );
    super.log(message);
  }

  public levelLog(message: any, ...params: [...any, string?]): void {
    // if (environment === 'production') return;
    this.log(message, ...params);
  }

  error(message: any, ...params: [...any, string?, string?]): void {
    const context = this.context || params.pop();
    appendFileSync(
      LoggerService.file,
      EOL +
        JSON.stringify({
          date: new Date().toISOString(),
          type: 'ERROR',
          context,
          message,
          params,
        }),
    );
    super.error(message);
  }

  warn(message: any, ...params: [...any, string?]): void {
    const context = this.context || params.pop();
    appendFileSync(
      LoggerService.file,
      EOL +
        JSON.stringify({
          date: new Date().toISOString(),
          type: 'WARN',
          context,
          message,
          params,
        }),
    );
    super.warn(message);
  }

  debug(message: any, ...params: [...any, string?]): void {
    const context = this.context || params.pop();
    appendFileSync(
      LoggerService.file,
      EOL +
        JSON.stringify({
          date: new Date().toISOString(),
          type: 'DEBUG',
          context,
          message,
          params,
        }),
    );
    super.debug(message);
  }

  verbose(message: any, ...params: [...any, string?]): void {
    const context = this.context || params.pop();
    appendFileSync(
      LoggerService.file,
      EOL +
        JSON.stringify({
          date: new Date().toISOString(),
          type: 'VERBOSE',
          context,
          message,
          params,
        }),
    );
    super.verbose(message);
  }
}
