import { format } from 'date-fns';
import { applyTimezoneToDate, formatDate, getUserTimezone } from './getClientDateAndTime';

export const getRangeDateString = (from?: string | number | Date, to?: string | number | Date, timezone?: string) => {
  const fromDate = from
    ? formatDate(
        applyTimezoneToDate(
          typeof from === 'string' ? from : new Date(from).toISOString(),
          getUserTimezone(timezone || '0'),
        ),
        'dd.MM.yyyy HH:mm:ss',
      )
    : '';
  const toDate = to
    ? formatDate(
        applyTimezoneToDate(typeof to === 'string' ? to : new Date(to).toISOString(), getUserTimezone(timezone || '0')),
        'dd.MM.yyyy HH:mm:ss',
      )
    : '';

  if (!fromDate && !toDate) return 'Не указано';

  return `${fromDate} - ${toDate}`;
};
