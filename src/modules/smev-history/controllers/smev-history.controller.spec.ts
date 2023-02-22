import { SmevHistoryController } from '@modules/smev-history/controllers/smev-history.controller';
import { Test } from '@nestjs/testing';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { mockSmevHistoryInstance } from '@modules/smev-history/services/find-smev-history.service.spec';
import { ExportSmevHistoryService } from '@modules/smev-history/services/export-smev-history.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('SmevHistoryController', () => {
  let smevHistoryController: SmevHistoryController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        {
          provide: FindSmevHistoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ data: [mockSmevHistoryInstance], total: 1 }),
          },
        },
        {
          provide: ExportSmevHistoryService,
          useValue: {},
        },
      ],
      controllers: [SmevHistoryController],
    }).compile();

    smevHistoryController = moduleRef.get(SmevHistoryController);
  });

  test('Should return all smevHistory', async () => {
    const result = await smevHistoryController.getAll({});

    expect(result).toEqual({
      data: [mockSmevHistoryInstance],
      total: 1,
    });
  });
});
