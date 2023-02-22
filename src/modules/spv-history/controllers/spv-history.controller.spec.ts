import { TestHelpers } from '@common/test/testHelpers';
import { ExportSpvHistoryService } from '@modules/spv-history/services/export-spv-history.service';
import { FindSpvHistoryService } from '@modules/spv-history/services/find-spv-history.service';
import {
  findSpvHistoryDtoMock,
  spvHistoryMock,
} from '@modules/spv-history/infrastructure/spv-history.elastic-repo.spec';
import { SpvHistoryController } from '@modules/spv-history/controllers/spv-history.controller';
import { Test } from '@nestjs/testing';
import { CreateSpvHistoryService } from '@modules/spv-history/services/create-spv-history.service';
import { GetLastSpvRequestNumber } from '@modules/spv-history/services/get-last-spv-request-number.service';
import { plainToInstance } from 'class-transformer';
import { FindSpvHistoryDto } from '@modules/spv-history/controllers/dtos/find-spv-history.dto';
import { validate } from 'class-validator';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportSpvHistoryServiceMockProvider = helpers.getMockExportServiceProvider(ExportSpvHistoryService);

export const findSpvHistoryMockProvider = helpers.getMockFindService(spvHistoryMock, FindSpvHistoryService);

const findSpvHistoryIncorrectDtoMock = {
  page: 1,
  pageSize: 'azxc',
  dateFrom: new Date('2022-06-30T21:39:29.971084'),
  dateTo: new Date('2022-06-30T21:39:29.971084'),
};

describe('SpvHistoryController', () => {
  let spvHistoryController: SpvHistoryController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [SpvHistoryController],
      providers: [
        exportSpvHistoryServiceMockProvider,
        findSpvHistoryMockProvider,
        {
          provide: CreateSpvHistoryService,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GetLastSpvRequestNumber,
          useValue: {
            handle: jest.fn().mockResolvedValue(6),
          },
        },
      ],
    }).compile();

    spvHistoryController = moduleRef.get<SpvHistoryController>(SpvHistoryController);
  });

  test('Controller should be defined', () => {
    expect(spvHistoryController).toBeDefined();
  });

  test('Should return spvHistory transformed', async () => {
    const response = await spvHistoryController.findAll(findSpvHistoryDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(spvHistoryMock, helpers.random.count));
  });

  test('Should return last request number', async () => {
    const response = await spvHistoryController.getLastRequestNumber();

    expect(response).toEqual(6);
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindSpvHistoryDto, findSpvHistoryDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindSpvHistoryDto, findSpvHistoryIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain('pageSize must be a number conforming to the specified constraints');
  });
});
