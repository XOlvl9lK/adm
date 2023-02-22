import '@js-joda/timezone';
import { ZonedDateTime, ZoneId, ZoneOffset, DateTimeFormatter, LocalDateTime } from '@js-joda/core';

export const getUserTimezone = (timezone: string): string => {
  if (!timezone || timezone === '0') return '+00:00';
  const minutes = parseInt(timezone, 10);
  const zone = ZoneId.ofOffset('GMT', ZoneOffset.ofHoursMinutes(Math.floor(minutes / 60), minutes % 60)).toString();
  return zone.substring(3);
};

export const getDateTimezone = (date: string) => {
  const parsed = ZonedDateTime.parse(date);
  const timezone = parsed.zone().toString();
  return timezone === 'Z' ? '+00:00' : timezone;
};

export const applyTimezoneToDate = (date: string, timezone: string) => {
  return ZonedDateTime.parse(date).withZoneSameInstant(ZoneId.of(timezone)).toString();
};

export const differenceBetweenTimezones = (timezone1: string, timezone2: string): number => {
  const [seconds1, seconds2] = [timezone1, timezone2].map((timezone) =>
    ZoneId.of(timezone).rules().offset(LocalDateTime.now()).totalSeconds(),
  );
  const diff = seconds1 - seconds2;
  return diff % 3600 > 0 ? parseFloat(((seconds1 - seconds2) / 3600).toFixed(1)) : (seconds1 - seconds2) / 3600;
};

export const formatDate = (date: string, format: string) =>
  ZonedDateTime.parse(date).format(DateTimeFormatter.ofPattern(format));

export const getClientDateAndTime = (timezone: string, date?: string | Date | number) => {
  if (!date) return '';
  if (typeof date === 'string' && timezone !== null) {
    let stringDate = date;
    if (stringDate.match('Z') || !stringDate.match(/[+|-][0-9]{2}:[0-9]{2}$/gm)) {
      stringDate = new Date(stringDate).toISOString();
    }
    if (!stringDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}[T][0-9]{2}/gm)) return '';
    const target = (stringDate[stringDate.length - 3] === '+' ? `${stringDate}:00` : stringDate).replace(' ', 'T');
    const userTimezone = getUserTimezone(timezone);
    const dateTimezone = getDateTimezone(target);
    const diff = differenceBetweenTimezones(dateTimezone, userTimezone);
    const convertedToUserTimezone = applyTimezoneToDate(target, userTimezone);
    const formatted = formatDate(convertedToUserTimezone, 'dd.MM.yyyy HH:mm:ss');
    return `${formatted} (${diff < 0 ? '' : '+'}${diff})`;
  }
  return formatDate(new Date(date).toISOString(), 'dd.MM.yyyy HH:mm:ss');
};

