import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationCommonSettingController } from './controllers/integration-common-setting.controller';
import { IntegrationCommonSettingEntity } from './domain/integration-common-setting.entity';
import { GetIntegrationCommonSettingService } from './services/get-integration-common-setting.service';
import { UpdateIntegrationCommonSettingService } from './services/update-integration-common-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationCommonSettingEntity])],
  controllers: [IntegrationCommonSettingController],
  providers: [GetIntegrationCommonSettingService, UpdateIntegrationCommonSettingService],
})
export class IntegrationCommonSettingModule {}
