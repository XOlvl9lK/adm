import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FileHistoryEntity } from '../domain/file-history.entity';
import { FindAllFileHistoryService } from './find-all-file-history.service';

const mockRepository = {
  findAndCount: jest.fn(),
};

describe('FindAllFileHistoryService', () => {
  let service: FindAllFileHistoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindAllFileHistoryService,
        {
          provide: getRepositoryToken(FileHistoryEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(FindAllFileHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all file history', async () => {
    const entity = { id: 1 };
    mockRepository.findAndCount.mockResolvedValue([[entity], 1]);
    const result = await service.handle({ page: 1, pageSize: 10 });
    expect(result).toStrictEqual({ data: [entity], total: 1 });
  });
});
