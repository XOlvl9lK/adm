import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { CancellationRecordCardController } from '@modules/journal-cancellation-record-card/controllers/cancellation-record-card.controller';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { ExportCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/export-cancellation-record-card.service';
import {
  cancellationRecordCardMock,
  findCancellationRecordCardDtoMock,
} from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/find-cancellation-record-card.service';
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line max-len
import { FindCancellationRecordCardDto } from '@modules/journal-cancellation-record-card/controllers/dto/find-cancellation-record-card.dto';
import { validate } from 'class-validator';
import { FormNumberEnum } from '@modules/journal-cancellation-record-card/domain/form-number.enum';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportCancellationRecordCardServiceMock = {
  exportXlsx: jest.fn(),
  exportXls: jest.fn(),
  exportOds: jest.fn(),
};

export const findCancellationRecordCardServiceMock = {
  findAll: jest
    .fn()
    .mockResolvedValue(helpers.getTransformedResponse(cancellationRecordCardMock, helpers.random.count)),
  findByIds: jest.fn().mockResolvedValue(helpers.getTransformedResponse(cancellationRecordCardMock)),
};

const findCancellationRecordCardIncorrectDtoMock = {
  page: 1,
  pageSize: 'qweasdzxc',
  uniqueNumber: '62b2dc07890a99d06a9f5c7f',
  formNumber: [FormNumberEnum.URP50],
  operationTypeTitle: '123qwe',
};

describe('CancellationRecordCardController', () => {
  let cancellationRecordCardController: CancellationRecordCardController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [CancellationRecordCardController],
      providers: [
        {
          provide: FindCancellationRecordCardService,
          useValue: findCancellationRecordCardServiceMock,
        },
        {
          provide: ExportCancellationRecordCardService,
          useValue: exportCancellationRecordCardServiceMock,
        },
      ],
    }).compile();

    cancellationRecordCardController = moduleRef.get<CancellationRecordCardController>(
      CancellationRecordCardController,
    );
  });

  test('Controller should be defined', () => {
    expect(cancellationRecordCardController).toBeDefined();
  });

  test('Should return cancellationRecordCard transformed', async () => {
    const response = await cancellationRecordCardController.findAll(findCancellationRecordCardDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationRecordCardMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindCancellationRecordCardDto, findCancellationRecordCardDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindCancellationRecordCardDto, findCancellationRecordCardIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(2);
    expect(JSON.stringify(errors)).toContain('pageSize must be a number conforming to the specified constraints');
    expect(JSON.stringify(errors)).toContain('operationTypeTitle must be a valid enum value');
  });
});
