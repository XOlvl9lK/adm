import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NsiDictionaryHttpTransport } from './infrastructure/nsi-dictionary.http-transport';
import { NsiDictionaryRequestService } from './services/nsi-dictionary-request.service';
import { NsiDictionaryController } from './controllers/nsi-dictionary.controller';
import { GetNsiDepartmentService } from './services/get-nsi-department.service';
import { GetNsiRegionService } from './services/get-nsi-region.service';
import { GetNsiSubdivisionService } from './services/get-nsi-subdivision.service';
import { GetNsiResponseMeasureService } from './services/get-nsi-response-measure.service';
import { GetNsiProsecutorOfficeService } from './services/get-nsi-prosecutor-office.service';
import { ClientCacheUpdateService } from '@modules/nsi-dictionary/services/client-cache-update.service';

@Module({
  imports: [ConfigModule],
  providers: [
    NsiDictionaryHttpTransport,
    NsiDictionaryRequestService,
    GetNsiRegionService,
    GetNsiDepartmentService,
    GetNsiSubdivisionService,
    GetNsiResponseMeasureService,
    GetNsiProsecutorOfficeService,
    ClientCacheUpdateService,
  ],
  controllers: [NsiDictionaryController],
})
export class NsiDictionaryModule {}
