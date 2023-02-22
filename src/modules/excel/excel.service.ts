import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { stream } from 'exceljs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Injectable()
export class ExcelService {
  protected writeContentHeader(response: Response, filename: string): void {
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(filename)}`);
  }

  public async createHttpStream(
    response: Response,
    filename: string,
    handler: (workbook: stream.xlsx.WorkbookWriter) => void | Promise<void>,
  ): Promise<void> {
    this.writeContentHeader(response, filename + `.xlsx`);
    const workbook = new stream.xlsx.WorkbookWriter({
      stream: response,
    });
    try {
      await handler(workbook);
    } catch (err) {
      console.log(err);
    } finally {
      await workbook.commit();
    }
  }
}
