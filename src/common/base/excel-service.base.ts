import { Response } from 'express';
import { ExcelHelper } from '@modules/excel/infrastructure/excel.helper';
import { chunk } from 'lodash';
import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { applyTimezoneToDate, formatDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { createReadStream, unlinkSync, writeFile } from 'fs';
import { join } from 'path';
import { ExportJob } from '@modules/export-job/domain/export-job';
import { ListRequestDto } from '@common/utils/types';
import { execSync } from 'child_process';
import internal from 'stream';

interface ExcelFileNamePattern {
  xlsx: string;
  xls: string;
  ods?: string;
  native: string;
}

export type ExportFormat = 'xls' | 'xlsx' | 'ods';

@Injectable()
export class ExcelServiceBase {
  protected readonly chunkSize = {
    xlsx: 900000,
    xls: 65000,
  };
  private tempPath = join(process.cwd(), 'temp')

  constructor(protected filenamePattern: ExcelFileNamePattern) {}

  private async convertFormat(inputBuffer: Buffer, format: 'xls' | 'ods', columnWidth?: number[]): Promise<Buffer> {
    const workBook = await XLSX.read(inputBuffer, { type: 'buffer' });
    if (columnWidth.length) {
      const ws = workBook.Sheets['Лист1'];
      ws['!cols'] = columnWidth.map((cw) => ({ width: cw }));
    }

    return await XLSX.write(workBook, {
      bookType: format,
      type: 'buffer',
    });
  }

  private async convertFormatWithLibreOffice(temporaryFile: string, format: ExportFormat) {
    await execSync(`soffice --headless --convert-to ${format} --outdir ${this.tempPath} ${join(this.tempPath, temporaryFile)}`)
    unlinkSync(`${this.tempPath}/${temporaryFile}`)
    return new Promise<internal.Readable>((resolve, reject) => {
      const stream = createReadStream(join(this.tempPath, `${temporaryFile.split('.')[0]}.${format}`))
      stream.on('error', e => reject(e))
      stream.on('open', () => resolve(stream))
    })
  }

  private async chunkFiles<Dto, Data>(
    excelCreator: (dto: Dto, data: Data[]) => ExcelHelper,
    dto: Dto,
    data: Data[],
    chunkSize: number,
  ) {
    const chunkedData = chunk(data, chunkSize);
    const buffers = await Promise.all(chunkedData.map((chunk) => excelCreator(dto, chunk).writeBuffer()));
    const columnWidth = excelCreator(dto, chunkedData[0]).getColumnWidthForOtherFormats();
    return { buffers, columnWidth };
  }

  protected writeContentHeader(response: Response, filename: string): void {
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(filename)}`);
  }

  protected generateFilename(fileFormat: keyof ExcelFileNamePattern, userTimezone?: string, index?: number): string {
    const filename = this.filenamePattern[fileFormat];
    const timezone = userTimezone ? getUserTimezone(userTimezone) : '+00:00';
    const dateWithTimezone = applyTimezoneToDate(new Date().toISOString(), timezone);
    const date = formatDate(dateWithTimezone, "dd.MM.yyyy'_'HH.mm.ss");
    const formatted = filename.replace('{date}', date).replace('_{index}', index ? `_${index}` : '');
    return `${formatted}.${fileFormat === 'native' ? 'zip' : fileFormat}`;
  }

  protected async exportFile<Dto extends { timeZone?: string }, Data = any[]>(
    excelCreator: (dto: Dto, data: Data) => ExcelHelper,
    dto: Dto,
    data: Data,
    format: 'xlsx' | 'xls' | 'ods',
    response: Response,
  ) {
    const filename = this.generateFilename(format, dto.timeZone);
    this.writeContentHeader(response, filename);
    const excel = excelCreator(dto, data);
    if (format === 'xlsx') return excel.write(response);
    else {
      const inputBuffer = await excel.writeBuffer();
      const fileName = `temp${Math.round(Math.random() * 1000)}.xlsx`;
      await this.saveTemporaryFile(join(this.tempPath, fileName), inputBuffer);
      const fileStream = await this.convertFormatWithLibreOffice(fileName, format);
      return fileStream.pipe(response)
    }
  }

  protected async createTemporaryFile<Dto extends ListRequestDto & { timeZone?: string }, Data>(
    excelCreator: (dto: Dto, data: Data[]) => ExcelHelper,
    dto: Dto,
    format: ExportFormat,
    exportJob: ExportJob,
  ) {
    const excelObject = excelCreator(dto, []);
    const excelBuffer: Buffer = await excelObject.writeBuffer();
    await this.saveTemporaryFile(join(process.cwd(), 'temp', 'temp_' + exportJob.id), excelBuffer);
  }

  private saveTemporaryFile(path: string, file: Buffer) {
    return new Promise<void>((resolve, reject) => {
      writeFile(path, file, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
