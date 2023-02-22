import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { FileHistoryEntity } from '../domain/file-history.entity';
import { FindFileHistoryByIdService } from './find-file-history-by-id.service';

const mockRepository = {
  findAndCount: jest.fn(),
};

describe('FindFileHistoryByIdService', () => {
  let service: FindFileHistoryByIdService;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(FileHistoryEntity),
          useValue: mockRepository,
        },
        FindFileHistoryByIdService,
      ],
    }).compile();
    service = moduleRef.get(FindFileHistoryByIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct values', async () => {
    const payload = [1];
    const expected = [1];
    mockRepository.findAndCount.mockResolvedValue([expected, 1]);
    const result = await service.handle(payload);
    expect(mockRepository.findAndCount).toBeCalledWith({
      where: {
        id: In(expected),
      },
    });
    expect(result).toStrictEqual({ data: expected, total: 1 });
  });

  it('should return empty array and not call repository if ids not provided', async () => {
    const mockPayload = undefined;
    const expected = { total: 0, data: [] };
    const result = await service.handle(mockPayload);
    expect(mockRepository.findAndCount).not.toBeCalled();
    expect(result).toStrictEqual(expected);
  });
});
