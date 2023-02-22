export enum StatusEnum {
  SUCCESS = 'Успешно загружен',
  IN_PROCESS = 'В обработке',
  PROCESS_IN_LK = 'Обработка в ЛК',
  PENDING_SIGNATURE = 'Ожидает подписи',
  FLK_ERRORS = 'Загружен с ошибками ФЛК',
  INVALID_CERTIFICATE = 'Сертификат недействителен',
  INVALID_SIGNATURE = 'Электронная подпись некорректна',
  DELAYED_LOADING = 'Отложенная загрузка',
  LOADING_ERROR = 'Ошибка при загрузке',
}
