import { Test } from '@nestjs/testing';
import { FileHistoryElasticRepo } from '../infrastructure/file-history.elastic-repo';
import { GetLastRequestDateService } from './get-last-request-date.service';

const mockElasticRepo = {
  getLastRequestDate: jest.fn().mockImplementation(),
};

describe('GetLastRequestDateService', () => {
  let service: GetLastRequestDateService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: FileHistoryElasticRepo, useValue: mockElasticRepo }, GetLastRequestDateService],
    }).compile();
    service = moduleRef.get<GetLastRequestDateService>(GetLastRequestDateService);
  });

  beforeEach(() => jest.resetAllMocks());

  it('should be defined', () => expect(service).toBeDefined());

  describe('#handle()', () => {
    it('should return proper date value with both parameters', async () => {
      const mockDepartment = 'mockDepartment';
      const mockDivision = 'mockDivision';
      const mockResult = { Date: new Date().toString() };
      jest.spyOn(mockElasticRepo, 'getLastRequestDate').mockImplementation(() => mockResult.Date);
      const result = await service.handle({
        divisionTitle: mockDivision,
        departmentTitle: mockDepartment,
      });
      expect(mockElasticRepo.getLastRequestDate).toBeCalledTimes(1);
      expect(mockElasticRepo.getLastRequestDate).toBeCalledWith(mockDepartment, mockDivision);
      expect(result).toStrictEqual(mockResult);
    });

    it('should return proper date value with only department parameter', async () => {
      const mockDepartment = 'mockDepartment';
      const mockResult = { Date: new Date().toString() };
      jest.spyOn(mockElasticRepo, 'getLastRequestDate').mockImplementation(() => mockResult.Date);
      const result = await service.handle({
        departmentTitle: mockDepartment,
      });
      expect(mockElasticRepo.getLastRequestDate).toBeCalledTimes(1);
      expect(mockElasticRepo.getLastRequestDate).toBeCalledWith(mockDepartment, undefined);
      expect(result).toStrictEqual(mockResult);
    });
  });
});
