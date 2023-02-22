export enum RequestStateEnum {
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
}

export const RequestStateEnumTranslated: Record<RequestStateEnum, string> = {
  [RequestStateEnum.IN_PROCESS]: 'В процессе',
  [RequestStateEnum.COMPLETED]: 'Выполнено',
  [RequestStateEnum.FAILED]: 'Не выполнено',
  [RequestStateEnum.ERROR]: 'Ошибка',
};
