import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { Response } from 'express';
import { ExportFileHistoryService } from '../services/export-file-history.service';
import { FindAllFileHistoryService } from '../services/find-all-file-history.service';
import { GetLastRequestDateService } from '../services/get-last-request-date.service';
import { FileHistoryController } from './file-history.controller';

const mockService = {
  handle: jest.fn(),
};

const mockExportService = {
  exportXlsx: jest.fn(),
  exportXls: jest.fn(),
  exportOds: jest.fn(),
};

const mockResponse = {};

describe('FileHistoryController', () => {
  let controller: FileHistoryController;

  beforeEach(() => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [FileHistoryController],
      providers: [
        { provide: GetLastRequestDateService, useValue: mockService },
        { provide: FindAllFileHistoryService, useValue: mockService },
        { provide: ExportFileHistoryService, useValue: mockExportService },
      ],
    }).compile();
    controller = moduleRef.get(FileHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return file-history', async () => {
    const mockPayload = { page: 1, pageSize: 1 };
    const expected = [];
    jest.spyOn(mockService, 'handle').mockImplementation(() => expected);
    const result = await controller.findAll(mockPayload);
    expect(result).toStrictEqual(expected);
    expect(mockService.handle).toBeCalledWith(mockPayload);
  });

  it('should return last request date', async () => {
    const mockPayload = { divisionTitle: 'string', departmentTitle: 'string' };
    const expected = '1';
    jest.spyOn(mockService, 'handle').mockImplementation(() => expected);
    const result = await controller.getLastRequestDate(mockPayload);
    expect(result).toStrictEqual(expected);
    expect(mockService.handle).toBeCalledWith(mockPayload);
  });

  it('should return exported xlsx', async () => {
    const mockPayload = { page: 1 };
    const expected = 1;
    jest.spyOn(mockExportService, 'exportXlsx').mockImplementation(() => expected);
    const result = await controller.exportXlsx(mockPayload, mockResponse as Response);
    expect(result).toStrictEqual(expected);
    expect(mockExportService.exportXlsx).toBeCalledWith(mockPayload, mockResponse);
  });

  it('should return exported xls', async () => {
    const mockPayload = { page: 1 };
    const expected = 1;
    jest.spyOn(mockExportService, 'exportXls').mockImplementation(() => expected);
    const result = await controller.exportXls(mockPayload, mockResponse as Response);
    expect(result).toStrictEqual(expected);
    expect(mockExportService.exportXls).toBeCalledWith(mockPayload, mockResponse);
  });

  it('should return exported ods', async () => {
    const mockPayload = { page: 1 };
    const expected = 1;
    jest.spyOn(mockExportService, 'exportOds').mockImplementation(() => expected);
    const result = await controller.exportOds(mockPayload, mockResponse as Response);
    expect(result).toStrictEqual(expected);
    expect(mockExportService.exportOds).toBeCalledWith(mockPayload, mockResponse);
  });
});
