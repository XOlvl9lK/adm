import { TestHelpers } from '@common/test/testHelpers';
import {
  findNsiChangeDtoMock,
  nsiChangeMock,
} from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo.spec';
import { FindNsiChangeService } from '@modules/journal-nsi-change/services/find-nsi-change.service';
import { NsiChangeActionEnum } from '@modules/journal-nsi-change/domain/nsi-change-action.enum';
import { NsiChangeObjectEnum } from '@modules/journal-nsi-change/domain/nsi-change-object.enum';
import { NsiChangeController } from '@modules/journal-nsi-change/controllers/nsi-change.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { FindNsiChangeDto } from '@modules/journal-nsi-change/controllers/dto/find-nsi-change.dto';
import { validate } from 'class-validator';
import { ExportNsiChangeService } from '@modules/journal-nsi-change/services/export-nsi-change.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportNsiChangeServiceMockProvider = helpers.getMockExportServiceProvider(ExportNsiChangeService);

export const findNsiChangeServiceMockProvider = helpers.getMockFindService(nsiChangeMock, FindNsiChangeService);

const findNsiChangeIncorrectMockDto = {
  page: 1,
  pageSize: 10,
  userName: ['Romero'],
  ipAddress: 123,
  eventDate: ['2015-05-24T08:40:29-04:00', '2015-05-24T08:40:29-04:00'] as [string, string],
  eventTitle: [NsiChangeActionEnum.CREATE],
  objectTitle: [NsiChangeObjectEnum.CATALOGUE],
};

describe('NsiChangeController', () => {
  let nsiChangeController: NsiChangeController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [NsiChangeController],
      providers: [findNsiChangeServiceMockProvider, exportNsiChangeServiceMockProvider],
    }).compile();

    nsiChangeController = moduleRef.get<NsiChangeController>(NsiChangeController);
  });

  test('Controller should be defined', () => {
    expect(nsiChangeController).toBeDefined();
  });

  test('Should return nsiChange transformed', async () => {
    const response = await nsiChangeController.getAll(findNsiChangeDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(nsiChangeMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindNsiChangeDto, findNsiChangeDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindNsiChangeDto, findNsiChangeIncorrectMockDto);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(2);
    expect(JSON.stringify(errors)).toContain('userName must be a string');
    expect(JSON.stringify(errors)).toContain('ipAddress must be a string');
  });
});
