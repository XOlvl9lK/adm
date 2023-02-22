import { faker } from '@faker-js/faker';
import { Writable, WritableOptions } from 'stream';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const archiver = require('archiver');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const httpMocks = require('node-mocks-http');

export class TestHelpers {
  private readonly random: {
    id: string;
    ids: string[];
    count: number;
    fileName: string;
    buffer: Buffer;
    date: Date;
    str: string;
  };
  private readonly response;
  private readonly archiverProvider = {
    provide: ArchiverService,
    useValue: {
      zip: jest.fn().mockResolvedValue(archiver('zip', { zlib: { level: 5 } }).finalize()),
    },
  };
  private readonly kafkaServiceMock = {
    send: jest.fn(),
  };
  private readonly kafkaServiceMockProvider = {
    provide: KafkaService,
    useValue: this.kafkaServiceMock,
  };

  constructor() {
    this.random = {
      id: faker.datatype.uuid(),
      ids: Array.from({ length: 5 }).map(() => faker.datatype.uuid()),
      count: +faker.random.numeric(1),
      fileName: faker.system.commonFileName(),
      buffer: Buffer.from(faker.lorem.paragraph()),
      date: faker.date.past(),
      str: faker.lorem.paragraph(),
    };
    this.response = httpMocks.createResponse();
  }

  private getSearchResult<T>(value: T) {
    return {
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [{ _source: value, _id: 'id' }],
      },
    };
  }

  private getTransformedResponse<T>(value: T, count = 1) {
    return { total: count, data: [{ id: 'id', ...value }] };
  }

  private getMgetResult<T>(value: T) {
    return {
      docs: [
        {
          _source: value,
          _id: 'id',
          _index: 'string',
          _version: 1,
          _seq_no: 1,
          _primary_term: 1,
          found: true,
        },
      ],
    };
  }

  private getMockElasticRepo<T>(mockData: T) {
    return {
      findAll: jest.fn().mockResolvedValue(this.getSearchResult(mockData)),
      transformSearchToResponse: jest.fn().mockResolvedValue(this.getTransformedResponse(mockData)),
      getByIds: jest.fn().mockResolvedValue(this.getMgetResult(mockData)),
      transformGetToResponse: jest.fn().mockResolvedValue(this.getTransformedResponse(mockData)),
    };
  }

  private getMockFindServiceProvider<T, K>(mockData: T, Constructor: new (...args: any) => K) {
    return {
      provide: Constructor,
      useValue: {
        findAll: jest.fn().mockResolvedValue(this.getTransformedResponse(mockData, this.random.count)),
        findByIds: jest.fn().mockResolvedValue(this.getTransformedResponse(mockData)),
      },
    };
  }

  private getMockExportServiceProvider<T>(Constructor: new (...args: any) => T) {
    return {
      provide: Constructor,
      useValue: {
        exportXlsx: jest.fn().mockImplementation((dto: any, response: Response) => {
          response.write(this.random.buffer);
          response.end();
        }),
        exportXls: jest.fn().mockImplementation((dto: any, response: Response) => {
          response.write(this.random.buffer);
          response.end();
        }),
        exportOds: jest.fn().mockImplementation((dto: any, response: Response) => {
          response.write(this.random.buffer);
          response.end();
        }),
      },
    };
  }

  private getMockRepository<T, K>(data: T) {
    return {
      find: jest.fn().mockResolvedValue([data]),
      save: jest.fn().mockImplementation((...args: T[]) => Promise.resolve(args)),
      findAndCount: jest.fn().mockResolvedValue([[data], this.random.count]),
      findOne: jest.fn().mockResolvedValue(data),
      delete: jest.fn(),
    };
  }

  getHelpers() {
    return {
      random: this.random,
      getSearchResult: this.getSearchResult,
      getTransformedResponse: this.getTransformedResponse,
      getMgetResult: this.getMgetResult,
      response: this.response,
      archiverProvider: this.archiverProvider,
      getMockElasticRepo: this.getMockElasticRepo,
      getMockFindService: this.getMockFindServiceProvider,
      getMockExportServiceProvider: this.getMockExportServiceProvider,
      kafkaServiceMock: this.kafkaServiceMock,
      kafkaServiceMockProvider: this.kafkaServiceMockProvider,
      getMockRepository: this.getMockRepository,
    };
  }
}

export class MockResponse extends Writable {
  constructor(opts?: WritableOptions) {
    super(opts);
  }

  setHeader = jest.fn();
  _write(chunk, encoding, callback) {
    chunk.toString();

    callback();
  }
}
