import * as xmlbuilder from 'xmlbuilder';

interface InnerData {
  [key: string]: string | number | Date;
}

export class XmlHelper {
  private readonly xml: xmlbuilder.XMLElement;

  constructor(rootTag: string) {
    this.xml = xmlbuilder.create(rootTag);
  }

  append(tag: string, data: InnerData[] | string | number) {
    if (typeof data === 'string' || typeof data === 'number') {
      this.xml.ele(tag, {}, data);
    } else {
      data.forEach((d) => {
        const item = tag === 'default' ? this.xml : this.xml.ele(tag);
        Object.entries(d).forEach(([element, value]) => {
          item.ele(element, {}, value);
        });
      });
    }
    return this;
  }

  end() {
    return this.xml.end();
  }
}
