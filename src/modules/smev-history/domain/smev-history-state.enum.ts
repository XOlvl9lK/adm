export enum SmevHistoryStateEnum {
  NEW = 'NEW',
  ACK = 'ACK',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  NEW_ERROR = 'NEW_ERROR',
  ACK_ERROR = 'ACK_ERROR',
  IN_PROCESS_ERROR = 'IN_PROCESS_ERROR',
  COMPLETED_ERROR = 'COMPLETED_ERROR',
}

export const SmevHistoryStateTranslated: Record<SmevHistoryStateEnum, string> = {
  [SmevHistoryStateEnum.NEW]: 'Получение',
  [SmevHistoryStateEnum.ACK]: 'Подтверждение',
  [SmevHistoryStateEnum.IN_PROCESS]: 'В процессе',
  [SmevHistoryStateEnum.COMPLETED]: 'Выполнено',
  [SmevHistoryStateEnum.NEW_ERROR]: 'Ошибка получения',
  [SmevHistoryStateEnum.ACK_ERROR]: 'Ошибка подтверждения',
  [SmevHistoryStateEnum.IN_PROCESS_ERROR]: 'Ошибка выполнения',
  [SmevHistoryStateEnum.COMPLETED_ERROR]: 'Ошибка отправки',
};
