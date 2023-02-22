import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { UpdateIntegration } from '@modules/integration/services/update-integration.service';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FileFilterDto } from './file-filter.dto';
import { IntegrationDivisionEntityDto } from './integration-division-entity.dto';
import { SchedulerEntityDto } from './scheduler-entity.dto';
import { SpvSmevFilterDto } from './spv-smev-filter.dto';

export class UpdateIntegrationDto implements UpdateIntegration {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsEnum(IntegrationTypeEnum)
  type?: IntegrationTypeEnum;

  @IsOptional()
  @IsEnum(ConditionTypeEnum)
  condition?: ConditionTypeEnum;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsOptional()
  @IsString()
  departmentName?: string;

  @IsOptional()
  @IsNumber()
  divisionId?: number;

  @IsOptional()
  @IsString()
  divisionName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpvSmevFilterDto)
  spvFilter?: SpvSmevFilterDto;

  @IsOptional()
  @Transform(({ value }) => value + '')
  @IsString()
  spvExternalSystemId?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpvSmevFilterDto)
  smevFilter?: SpvSmevFilterDto;

  @IsOptional()
  @IsString()
  smevMnemonic?: string;

  @IsOptional()
  @IsString()
  smevAuthorityCertificate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileFilterDto)
  fileFilter?: FileFilterDto;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SchedulerEntityDto)
  fileSchedulerDpuKusp?: SchedulerEntityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SchedulerEntityDto)
  fileSchedulerStatisticalReport?: SchedulerEntityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileFilterDto)
  manualExportFilter?: FileFilterDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IntegrationDivisionEntityDto)
  divisions?: IntegrationDivisionEntityDto[];

  @IsOptional()
  @IsString()
  spvCert?: string;
}
