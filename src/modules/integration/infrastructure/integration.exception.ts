import { BaseException } from '@common/base/exception.base';
import { HttpStatus } from '@nestjs/common';

export class IntegrationException extends BaseException {
  static NameExists() {
    return new IntegrationException(
      HttpStatus.BAD_REQUEST,
      'Внешнее взаимодействие с таким именем и типом уже существует',
    );
  }
  static IntegrationNotExists() {
    return new IntegrationException(HttpStatus.BAD_REQUEST, 'Внешнее взаимодействие с таким ID не существует');
  }

  static MnemonicExists() {
    return new IntegrationException(
      HttpStatus.BAD_REQUEST,
      'Внешнее взаимодействие СМЭВ с такой мнемоникой уже существует',
    );
  }
}
