import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { DayOfWeekEnum, SchedulerEntity, SchedulerTypeEnum } from '../../domain/scheduler/scheduler.entity';

export class SchedulerEntityDto implements SchedulerEntity {
  @IsEnum(SchedulerTypeEnum)
  type: SchedulerTypeEnum;

  @IsOptional()
  @ValidateIf((dto) => dto.type !== SchedulerTypeEnum.DAILY)
  @IsString()
  @ValidateIf((dto) => dto.type === SchedulerTypeEnum.WEEKLY)
  @IsEnum(DayOfWeekEnum)
  day?: DayOfWeekEnum | string;

  @IsString()
  time: string;
}
