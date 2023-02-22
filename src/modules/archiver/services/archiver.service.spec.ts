import { TestHelpers } from '@common/test/testHelpers';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import { Test } from '@nestjs/testing';

const helpers = new TestHelpers().getHelpers();

const mockData = { source: helpers.random.buffer, fileName: helpers.random.fileName };

describe('ArchiverService', () => {
  let archiverService: ArchiverService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ArchiverService],
    }).compile();

    archiverService = moduleRef.get<ArchiverService>(ArchiverService);
  });

  test('Service should be defined', () => {
    expect(archiverService).toBeDefined();
  });

  test('Should archive data', async () => {
    const zipSpy = jest.spyOn(archiverService, 'zip');

    await archiverService.zip(mockData);

    expect(zipSpy).toHaveBeenCalledTimes(1);
    expect(zipSpy).toHaveBeenCalledWith(mockData);
  });
});
