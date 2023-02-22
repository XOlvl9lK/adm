import { Global, Module } from '@nestjs/common';
import { ArchiverService } from '@modules/archiver/services/archiver.service';

@Global()
@Module({
  providers: [ArchiverService],
  exports: [ArchiverService],
})
export class ArchiverModule {}
