import { Global, Module } from '@nestjs/common';
import { WorkerService } from '@modules/worker/services/worker.service';

@Global()
@Module({
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
