import { HttpException, HttpStatus } from '@nestjs/common';

export class ExportJobException extends HttpException {
  static CreateError() {
    throw new ExportJobException('Ошибка при создании задачи экспорта', HttpStatus.BAD_REQUEST);
  }

  static UpdateError() {
    throw new ExportJobException('Ошибка при обновлении задачи экспорта', HttpStatus.BAD_REQUEST);
  }

  static FileNotFound() {
    throw new ExportJobException('Файл с таким именем не найден', HttpStatus.NOT_FOUND);
  }
}
