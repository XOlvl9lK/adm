export enum SchedulerTypeEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  EVERY_DECADE = 'EVERY_DECADE',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALY = 'ANNUALY',
}

export enum DayOfWeekEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface SchedulerEntity {
  type: SchedulerTypeEnum;
  day?: DayOfWeekEnum | string;
  time: string;
}
