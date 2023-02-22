import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, NotEquals, ValidateNested } from 'class-validator';
import { CreateExternalIntegration } from '../../services/create-external-integration.service';
import { FileFilterDto } from './file-filter.dto';
import { IntegrationDivisionEntityDto } from './integration-division-entity.dto';
import { SchedulerEntityDto } from './scheduler-entity.dto';
import { SpvSmevFilterDto } from './spv-smev-filter.dto';

export class CreateExternalIntegrationDto implements CreateExternalIntegration {
  @IsEnum(IntegrationTypeEnum)
  @NotEquals(IntegrationTypeEnum.MANUAL_EXPORT)
  type: IntegrationTypeEnum.SPV | IntegrationTypeEnum.SMEV | IntegrationTypeEnum.FILE;

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
  @IsString()
  spvCert?: string;

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
  @ValidateNested({ each: true })
  @Type(() => IntegrationDivisionEntityDto)
  divisions?: IntegrationDivisionEntityDto[];
}
