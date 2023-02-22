import * as ExcelJs from 'exceljs';
import { Response } from 'express';

export type ColumnAlignment = {
  [key: string]: Partial<ExcelJs.Alignment>;
};

export type Cell = {
  index: string;
  value: string;
  bold?: boolean;
};

export class ExcelHelper {
  private readonly workbook: ExcelJs.Workbook;
  private readonly sheet: ExcelJs.Worksheet;
  private columnOrdering: string[];
  private columnWidthForOtherFormats: number[];
  private widthColumnMapping: Record<string, number> = {};

  constructor() {
    this.workbook = new ExcelJs.Workbook();
    this.sheet = this.workbook.addWorksheet('Лист1');
    this.workbook.created = new Date('2022-07-19T07:06:44.620Z');
    this.workbook.modified = new Date('2022-07-19T07:06:44.620Z');
  }

  applyColumnOrdering(columnOrdering: string[]) {
    if (columnOrdering && columnOrdering.length) this.columnOrdering = columnOrdering;
    return this;
  }

  title(title: string, mergedSells: string) {
    this.sheet.mergeCells(mergedSells);
    const titleCell = this.sheet.getCell(mergedSells.split(':')[0]);
    titleCell.font = {
      name: 'Times New Roman',
      size: 14,
      bold: true,
    };
    titleCell.value = title;
    this.sheet.getRow(1).height = 20;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    return this;
  }

  subTitle(subTitle: string, mergedSells: string, centered = true) {
    this.sheet.mergeCells(mergedSells);
    const titleCell = this.sheet.getCell(mergedSells.split(':')[0]);
    titleCell.font = {
      name: 'Times New Roman',
      size: 12,
      bold: false,
    };
    titleCell.value = subTitle;
    if (centered) titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    return this;
  }

  columns(columns: Partial<ExcelJs.Column>[]) {
    const { columnOrdering } = this;
    let cols = columns;
    if (columnOrdering && columnOrdering.length) {
      const _cols = columns.sort((a, b) => (columnOrdering.includes(b.key) ? 1 : -1));
      const unusedCols = _cols.slice(columnOrdering.length, cols.length);
      const usedCols = columnOrdering.map((key) => columns.find((c) => c.key === key));
      cols = [...usedCols, ...unusedCols];
    }
    this.sheet.columns = cols;
    this.columnWidthForOtherFormats = columns.map((c) => (c?.width ? c.width * 1.2 : 7));
    return this;
  }

  header(values: ({ title: string; key: string } | string)[], rowNumber = 1) {
    const { columnOrdering } = this;
    let normalizedColumns = values.map((value) => (typeof value === 'string' ? value : value.title));
    if (columnOrdering) {
      normalizedColumns = columnOrdering.flatMap((columnName) => {
        const cell = values.find((value) => typeof value !== 'string' && value.key === columnName);
        if (!cell) return [];
        return [typeof cell !== 'string' ? cell.title : cell];
      });
    }
    const headerRow = this.sheet.getRow(rowNumber);
    headerRow.values = normalizedColumns;
    headerRow.font = {
      name: 'Times New Roman',
      size: 12,
      bold: true,
    };
    headerRow.alignment = { wrapText: true, vertical: 'middle' };
    return this;
  }

  fill(data: Record<string, unknown>[], fromRow = 2) {
    const { columnOrdering } = this;

    data.reverse().forEach((row) => {
      let filteredRow = row;
      if (columnOrdering && columnOrdering.length) {
        filteredRow = this.columnOrdering.reduce(
          (acc, key) => ({
            ...acc,
            [key]: row[key],
          }),
          {},
        );
      }
      this.sheet.insertRow(fromRow, filteredRow);
      this.sheet.getRow(fromRow).alignment = {
        wrapText: true,
        vertical: 'middle',
      };
    });
    return this;
  }

  cells(cells: Cell[]) {
    cells.forEach(({ index, value, bold }) => {
      const cell = this.sheet.getCell(index);
      cell.value = value;
      cell.alignment = { wrapText: true, vertical: 'middle' };
      if (bold) cell.font = { bold: true };
    });
    return this;
  }

  columnWidth(cols: { [key: string]: number }) {
    Object.entries(cols).forEach(([col, width]) => {
      this.sheet.getColumn(col).width = width;
    });
    return this;
  }

  async write(response: Response) {
    const buffer = await this.writeBuffer();
    return response.end(buffer);
  }

  writeFile(fileName: string) {
    return this.workbook.xlsx.writeFile(fileName);
  }

  writeBuffer() {
    return this.workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }

  getColumnWidthForOtherFormats() {
    return this.columnWidthForOtherFormats;
  }
}
