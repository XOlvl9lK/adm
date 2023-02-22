import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

type PayloadFunction = (workBook: ExcelJS.Workbook) => Promise<void> | void;

@Injectable()
export class CreateExcelFileService {
  async handle(func: PayloadFunction): Promise<ArrayBuffer> {
    const workBook = new ExcelJS.Workbook();
    await func(workBook);
    return workBook.xlsx.writeBuffer();
  }
}
