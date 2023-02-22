import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { ExportTypicalViolationService } from '@modules/journal-typical-violation/services/export-typical-violation.service';
// eslint-disable-next-line max-len
import { FindTypicalViolationService } from '@modules/journal-typical-violation/services/find-typical-violation.service';
import {
  findTypicalViolationsDtoMock,
  typicalViolationsMock,
} from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo.spec';
import { OperationTypeTitleEnum } from '@modules/journal-typical-violation/domain/operation-type-title.enum';
// eslint-disable-next-line max-len
import { TypicalViolationsController } from '@modules/journal-typical-violation/controllers/typical-violations.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line max-len
import { FindTypicalViolationDto } from '@modules/journal-typical-violation/controllers/dtos/find-typical-violation.dto';
import { validate } from 'class-validator';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportTypicalViolationsMockProvider = helpers.getMockExportServiceProvider(ExportTypicalViolationService);

export const findTypicalViolationsMockProvider = helpers.getMockFindService(
  typicalViolationsMock,
  FindTypicalViolationService,
);

const findTypicalViolationsIncorrectDtoMock = {
  page: 1,
  pageSize: 10,
  userName: 'Wyatt',
  cardId: '62b2e885a09723076e917903',
  entityTypeTitle: ['asv'],
  operationTypeTitle: [OperationTypeTitleEnum.CONCLUSION_FROM_VIOLATION],
};

describe('TypicalViolationsController', () => {
  let typicalViolationsController: TypicalViolationsController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [TypicalViolationsController],
      providers: [exportTypicalViolationsMockProvider, findTypicalViolationsMockProvider],
    }).compile();

    typicalViolationsController = moduleRef.get<TypicalViolationsController>(TypicalViolationsController);
  });

  test('Controller should be defined', () => {
    expect(typicalViolationsController).toBeDefined();
  });

  test('Should return typicalViolations transformed', async () => {
    const response = await typicalViolationsController.findAll(findTypicalViolationsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(typicalViolationsMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindTypicalViolationDto, findTypicalViolationsDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindTypicalViolationDto, findTypicalViolationsIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('entityTypeTitle must be a valid enum value');
  });
});
