// eslint-disable-next-line max-len
import { CancellationKuspController } from '@modules/journal-cancellation-kusp/controllers/cancellation-kusp.controller';
import { Test } from '@nestjs/testing';
import { TestHelpers } from '@common/test/testHelpers';
import {
  cancellationKuspMock,
  findCancellationKuspDtoMock,
} from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindCancellationKuspService } from '@modules/journal-cancellation-kusp/services/find-cancellation-kusp.service';
// eslint-disable-next-line max-len
import { ExportCancellationKuspService } from '@modules/journal-cancellation-kusp/services/export-cancellation-kusp.service';
import clearAllMocks = jest.clearAllMocks;
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line max-len
import { FindCancellationKuspDto } from '@modules/journal-cancellation-kusp/controllers/dtos/find-cancellation-kusp.dto';
import { validate } from 'class-validator';
import { Response } from 'express';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

export const findCancellationKuspServiceMock = {
  findAll: jest.fn().mockResolvedValue(helpers.getTransformedResponse(cancellationKuspMock, helpers.random.count)),
  findByIds: jest.fn().mockResolvedValue(helpers.getTransformedResponse(cancellationKuspMock)),
};

const exportCancellationKuspServiceMock = {
  exportXlsx: jest.fn().mockImplementation((dto: any, response: Response) => {
    response.write(helpers.random.buffer);
    response.end();
  }),
  exportXls: jest.fn().mockImplementation((dto: any, response: Response) => {
    response.write(helpers.random.buffer);
    response.end();
  }),
  exportOds: jest.fn().mockImplementation((dto: any, response: Response) => {
    response.write(helpers.random.buffer);
    response.end();
  }),
};

export const exportCancellationKuspDtoMock = {
  page: 1,
  pageSize: 10,
  userLogin: 'Macdonald',
  columnKeys: ['userLogin'],
  timeZone: '180',
  viewer: 'PROK_GP',
  userHasChangedDivisionTitles: false,
};

const findCancellationKuspIncorrectDtoMock = {
  page: 'abc',
  pageSize: 10,
  userLogin: 10,
  kuspNumber: '62b2d91af2898f20a938b418',
};

describe('CancellationKuspController', () => {
  let cancellationKuspController: CancellationKuspController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [CancellationKuspController],
      providers: [
        {
          provide: FindCancellationKuspService,
          useValue: findCancellationKuspServiceMock,
        },
        {
          provide: ExportCancellationKuspService,
          useValue: exportCancellationKuspServiceMock,
        },
      ],
    }).compile();

    cancellationKuspController = moduleRef.get<CancellationKuspController>(CancellationKuspController);
  });

  test('Controller should be defined', () => {
    expect(cancellationKuspController).toBeDefined();
  });

  test('Should return cancellationKusp transformed', async () => {
    const response = await cancellationKuspController.findAll(findCancellationKuspDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationKuspMock, helpers.random.count));
  });

  test('File size should be grater than 0 on exportXlsx', async () => {
    await cancellationKuspController.exportXlsx(exportCancellationKuspDtoMock, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('File size should be grater than 0 on exportXls', async () => {
    await cancellationKuspController.exportXls(exportCancellationKuspDtoMock, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('File size should be grater than 0 on exportOds', async () => {
    await cancellationKuspController.exportOds(exportCancellationKuspDtoMock, helpers.response);

    const buffer = helpers.response._getBuffer();

    expect(Buffer.byteLength(buffer)).toBeGreaterThan(0);
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindCancellationKuspDto, findCancellationKuspDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindCancellationKuspDto, findCancellationKuspIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain('page must be a number conforming to the specified constraints');
    expect(JSON.stringify(errors)).toContain('userLogin must be a string');
  });

  afterEach(() => {
    clearAllMocks();
  });
});
