import { join } from 'path';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { parseStringPromise } from 'xml2js';

type ColumnWithSharedStringIndex = {
  column: ColumnKeys;
  sharedStringIndex: number;
};

export type ColumnKeys =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T';

export type GetXlsxRowFn<Data> = (d: Data) => Record<string, string | number>;

const dataColumns: ColumnKeys[] = [
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
];

export class ManualXlsxLibrary {
  private readonly encodingSettings = { encoding: 'utf8' as BufferEncoding };
  // Путь к папке с распакованными excel файлами
  private unzipFolderPath = join(process.cwd(), 'excel-unzip');
  // Путь к конкретному распакованному excel файлу
  private readonly unzippedExcelPath: string;
  // Путь к файлу sheet1.xml
  private readonly sheet1Path: string;
  // Путь к файлу sharedStrings.xml
  private readonly sharedStringsPath: string;

  // Последняя строка в sheet1.xml отсчёт идёт с 1
  private lastRowNumber = 1;
  private spans = '';
  // Последняя количество тэгов si в sharedStrings.xml отсчёт идёт с 0
  private totalSharedStrings = 0;
  private indexNumber = 0;

  // Последние строки в sheet1.xml
  private sheet1LastPart = '';
  // Последняя строка в sharedStrings.xml
  private sharedStringsLastPart = '</sst>';

  private columnKeys: string[];

  constructor(folderName: string, columnKeys: string[]) {
    this.unzippedExcelPath = join(this.unzipFolderPath, folderName);
    this.sheet1Path = join(this.unzippedExcelPath, 'xl', 'worksheets', 'sheet1.xml');
    this.sharedStringsPath = join(this.unzippedExcelPath, 'xl', 'sharedStrings.xml');
    this.columnKeys = columnKeys;
  }

  async prepareToEdit() {
    const sheet1 = readFileSync(this.sheet1Path, this.encodingSettings);
    const sharedStrings = readFileSync(this.sharedStringsPath, this.encodingSettings);

    const sheet1Xml = await parseStringPromise(sheet1, { async: true });
    const sharedStringsXml = await parseStringPromise(sharedStrings, { async: true });

    // Определяем сколько всего строк в файле
    const sheetDataRows = sheet1Xml.worksheet.sheetData[0].row;
    this.lastRowNumber = Number(sheetDataRows[sheetDataRows.length - 1].$.r);
    // Определям атрибут spans в строке
    this.spans = sheetDataRows[sheetDataRows.length - 1].$.spans;
    // Определяем количество тэгов si в sharedStrings.xml
    this.totalSharedStrings = sharedStringsXml.sst.si.length;

    const endIndex = sheet1.indexOf('</sheetData>');
    this.sheet1LastPart = sheet1.slice(endIndex, sheet1.length);
    writeFileSync(this.sheet1Path, sheet1.slice(0, endIndex), this.encodingSettings);
    writeFileSync(
      this.sharedStringsPath,
      sharedStrings.slice(0, sharedStrings.indexOf(this.sharedStringsLastPart)),
      this.encodingSettings,
    );
  }

  // По переданной data формируем тэги и добавляем их к sharedStrings.xml и sheet1.xml
  appendData<Data>(data: Data[], getRowData: GetXlsxRowFn<Data>) {
    let sharedStringsTags = '';
    let sheet1Tags = '';
    let columnsWithSharedStringIndex: ColumnWithSharedStringIndex[] = [];
    data.forEach((d) => {
      this.indexNumber++;
      this.lastRowNumber++;
      const rowData = this.applyColumnKeysOrder(getRowData(d));
      columnsWithSharedStringIndex.push({
        column: 'A',
        sharedStringIndex: this.indexNumber,
      });
      Object.entries(rowData).forEach(([key, value]) => {
        columnsWithSharedStringIndex.push({
          column: key as ColumnKeys,
          sharedStringIndex: this.totalSharedStrings,
        });
        sharedStringsTags += this.getSharedStringsRow(this.sanitizeValue(value));
        this.totalSharedStrings++;
      });
      sheet1Tags += this.getSheetDataRow(this.lastRowNumber, columnsWithSharedStringIndex);
      columnsWithSharedStringIndex = [];
    });
    this.appendToSharedStrings(sharedStringsTags);
    this.appendToSheet1(sheet1Tags);
  }

  private applyColumnKeysOrder(data: Record<string, string | number>) {
    if (this.columnKeys.length) {
      const orderedData = this.columnKeys.map((key) => data[key]).filter(Boolean);
      const result = {};
      for (let i = 0; i < dataColumns.length; i++) {
        if (!orderedData[i]) break;
        result[dataColumns[i]] = orderedData[i];
      }
      return result;
    }
    return data;
  }

  // Добавляет тэги к sharedStrings.xml
  private appendToSharedStrings(tags: string) {
    appendFileSync(this.sharedStringsPath, tags);
  }

  // Добавляет тэги к sheet1.xml
  private appendToSheet1(tags: string) {
    appendFileSync(this.sheet1Path, tags);
  }

  // Возвращает xml тэг <row r="1" x14ac:dyDescent="0.25" spans="1:6"> ... </row>
  private getSheetDataRow(r: number, columns: ColumnWithSharedStringIndex[]) {
    return `<row r="${r}" spans="${this.spans}" x14ac:dyDescent="0.25">
      ${columns
        .map(
          (c, i) =>
            `<c r="${c.column + r}" ${i === 0 ? '' : 't="s"'}>
              <v>${c.sharedStringIndex}</v>
            </c>`,
        )
        .join('')}
    </row>`;
  }

  // Возвращает xml тэг <si><t> ... </t></si>
  private getSharedStringsRow(data: string | number) {
    return `<si><t>${data}</t></si>`;
  }

  end() {
    this.appendToSharedStrings(this.sharedStringsLastPart);
    this.appendToSheet1(this.sheet1LastPart);
  }

  private sanitizeValue(data: string | number) {
    const lt = /</gm;
    const gt = />/gm;
    const ampersand = /&/gm;
    const singleQuote = /'/gm;
    const doubleQuote = /"/gm;
    return (data + '')
      .replace(lt, '&#60;')
      .replace(gt, '&#62;')
      .replace(ampersand, '&#38;')
      .replace(singleQuote, '&#39;')
      .replace(doubleQuote, '&#34;');
  }
}
