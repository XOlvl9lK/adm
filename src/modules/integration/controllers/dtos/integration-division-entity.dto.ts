import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SchedulerEntityDto } from './scheduler-entity.dto';

export class IntegrationDivisionEntityDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  divisionId!: number;

  @IsString()
  divisionName!: string;

  @IsString()
  path!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SchedulerEntityDto)
  schedulerDpuKusp: SchedulerEntityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SchedulerEntityDto)
  schedulerStatisticalReport: SchedulerEntityDto;
}
