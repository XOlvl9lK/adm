import { join } from 'path';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';

export type GetOdsRowFn<Data> = (d: Data) => Record<string, string | number>;

export class ManualOdsLibrary {
  private readonly encodingSettings = { encoding: 'utf8' as BufferEncoding };
  // Путь к папке с распакованными ods файлами
  private unzipFolderPath = join(process.cwd(), '..', 'excel-unzip');
  // Путь к конкретному распакованному ods файлу
  private readonly unzippedOdsPath: string;
  // Путь к файлу content.xml
  private readonly contentPath: string;

  // Номер п/п последней строки
  private indexNumber = 0;

  // Последняя часть в content.xml
  private lastPart = '';

  private columnKeys: string[];

  constructor(folderName: string, columnKeys: string[]) {
    this.unzippedOdsPath = join(this.unzipFolderPath, folderName);
    this.contentPath = join(this.unzippedOdsPath, 'content.xml');
    this.columnKeys = columnKeys;
  }

  async prepareToEdit() {
    const content = readFileSync(this.contentPath, this.encodingSettings);

    const endIndex = content.indexOf('</table:table>');
    this.lastPart = content.slice(endIndex, content.length);
    writeFileSync(this.contentPath, content.slice(0, endIndex), this.encodingSettings);
  }

  // По переданной data формируем тэги и добавляем их к content.xml
  appendData<Data>(data: Data[], getRowData: GetOdsRowFn<Data>) {
    let contentTags = '';
    data.forEach((d) => {
      this.indexNumber++;
      const row = this.applyColumnKeysOrder(getRowData(d));
      contentTags += this.getTableRow(row.map((c) => this.sanitizeValue(c)));
    });
    this.appendToContent(contentTags);
  }

  end() {
    this.appendToContent(this.lastPart);
  }

  private applyColumnKeysOrder(data: Record<string, string | number>) {
    if (this.columnKeys.length) {
      return this.columnKeys.map((key) => data[key]).filter(Boolean);
    }
    return Object.values(data);
  }

  // Добавляет тэги к content.xml
  private appendToContent(tags: string) {
    appendFileSync(this.contentPath, tags);
  }

  private getTableRow(columns: string[]) {
    return `<table:table-row>
      <table:table-cell office:value-type="float" office:value="${this.indexNumber}">
        <text:p>${this.indexNumber}</text:p>
      </table:table-cell>
      ${columns
        .map(
          (c) =>
            `<table:table-cell office:value-type="string">
              <text:p>${c}</text:p>
            </table:table-cell>`,
        )
        .join('')}
    </table:table-row>`;
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
