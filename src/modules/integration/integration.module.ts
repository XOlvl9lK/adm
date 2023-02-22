import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalIntegrationController } from './controllers/external-integration.controller';
import { ManualExportIntegrationController } from './controllers/manual-export-integration.controller';
import { IntegrationRepository } from './infrastructure/integration.repository';
import { CreateExternalIntegrationService } from './services/create-external-integration.service';
import { CreateManualExportIntegrationService } from './services/create-manual-export-integration.service';
import { DeleteIntegrationService } from './services/delete-integration.service';
import { FindAllIntegrationsService } from './services/find-all-integrations.service';
import { FindIntegrationByDepartmentService } from './services/find-integration-by-department.service';
import { FindIntegrationService } from './services/find-integration.service';
import { FindUniqueDepartmentsService } from './services/find-unique-departments.service';
import { UpdateIntegrationService } from './services/update-integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationRepository])],
  controllers: [ExternalIntegrationController, ManualExportIntegrationController],
  providers: [
    CreateExternalIntegrationService,
    CreateManualExportIntegrationService,
    UpdateIntegrationService,
    FindIntegrationService,
    FindAllIntegrationsService,
    DeleteIntegrationService,
    FindIntegrationByDepartmentService,
    FindUniqueDepartmentsService,
  ],
  exports: [FindIntegrationByDepartmentService],
})
export class IntegrationModule {}
