import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateManualExportIntegration } from '../../services/create-manual-export-integration.service';
import { FileFilterDto } from './file-filter.dto';
import { IntegrationDivisionEntityDto } from './integration-division-entity.dto';

export class CreateManualExportIntegrationDto implements CreateManualExportIntegration {
  @IsEnum(ConditionTypeEnum)
  condition: ConditionTypeEnum;

  @IsNumber()
  departmentId: number;

  @IsString()
  departmentName: string;

  @IsOptional()
  @IsNumber()
  divisionId?: number;

  @IsOptional()
  @IsString()
  divisionName?: string;

  @ValidateNested()
  @Type(() => FileFilterDto)
  manualExportFilter: FileFilterDto;

  @ValidateNested({ each: true })
  @Type(() => IntegrationDivisionEntityDto)
  divisions: IntegrationDivisionEntityDto[];

  @IsString()
  @IsOptional()
  filePath?: string;
}
