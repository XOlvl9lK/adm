import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmevHistoryRepository } from '@modules/smev-history/infrastructure/smev-history.repository';
import { SmevHistoryController } from '@modules/smev-history/controllers/smev-history.controller';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { ExportSmevHistoryService } from '@modules/smev-history/services/export-smev-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmevHistoryRepository])],
  controllers: [SmevHistoryController],
  providers: [FindSmevHistoryService, ExportSmevHistoryService],
})
export class SmevHistoryModule {}
