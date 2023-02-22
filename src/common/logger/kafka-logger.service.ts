import { Injectable } from '@nestjs/common';
import { LogEntry, logLevel as LogLevel } from 'kafkajs';
import { LoggerService } from './logger.service';

@Injectable()
export class KafkaLoggerService {
  private logger!: LoggerService;

  constructor(context?: string) {
    this.logger = new LoggerService(context || 'KAFKA');
  }

  private _logCreator(entry: LogEntry): void {
    switch (entry.level) {
      case LogLevel.DEBUG:
        return this.logDebug(entry);
      case LogLevel.INFO:
        return this.logInfo(entry);
      case LogLevel.WARN:
        return this.logWarn(entry);
      case LogLevel.ERROR:
        return this.logError(entry);
    }
  }

  logCreator(logLevel: LogLevel): (entry: LogEntry) => void {
    return this._logCreator.bind(this);
  }

  private logInfo(entry: LogEntry): void {
    this.logger.log(entry.log.message, entry.namespace, entry.log);
  }

  private logWarn(entry: LogEntry): void {
    this.logger.warn(entry.log.message, entry.namespace, entry.log);
  }

  private logDebug(entry: LogEntry): void {
    this.logger.debug(entry.log.message, entry.namespace, entry.log);
  }

  private logError(entry: LogEntry & { stack?: string }): void {
    this.logger.error(entry.log.message, entry.namespace, entry.log);
  }
}
