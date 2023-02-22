import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';

export const getExportJobTitle = (
  journalTitle: string,
  userTimezone: string,
  period?: [string | null, string | null],
) => {
  if (period?.[0] && period?.[1]) {
    return `${journalTitle}, с ${getClientDateAndTime(userTimezone, period[0])} по ${getClientDateAndTime(
      userTimezone,
      period[1],
    )}`;
  }
  return `${journalTitle}, весь период`;
};
