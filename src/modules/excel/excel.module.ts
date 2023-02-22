import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { CreateExcelFileService } from './services/create-excel-file.service';

@Module({
  exports: [ExcelService, CreateExcelFileService],
  providers: [ExcelService, CreateExcelFileService],
})
export class ExcelModule {}
