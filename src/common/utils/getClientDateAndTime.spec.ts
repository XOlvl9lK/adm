import {
  applyTimezoneToDate,
  differenceBetweenTimezones,
  formatDate,
  getClientDateAndTime,
  getDateTimezone,
  getUserTimezone,
} from '@common/utils/getClientDateAndTime';

const timezone = '180';
const date = '2022-06-30T18:45:43.463+03:00';

describe('getClientDateAndTime', () => {
  describe('getUserTimezone', () => {
    it('should return user timezone', () => {
      expect(getUserTimezone(timezone)).toBe('+03:00');
    });
  });

  describe('getDateTimezone', () => {
    it('should return date timezone', () => {
      expect(getDateTimezone(date)).toBe('+03:00');
    });
  });

  describe('applyTimezoneToDate', () => {
    it('should apply timezone to date', () => {
      expect(applyTimezoneToDate(date, '+06:00')).toBe('2022-06-30T21:45:43.463+06:00');
    });
  });

  describe('differenceBetweenTimezones', () => {
    it('should return difference between timezones', () => {
      expect(differenceBetweenTimezones('+03:00', '+06:00')).toBe(-3);
    });
  });

  describe('formatDate', () => {
    it('should format date', () => {
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2022-06-30');
    });
  });

  describe('getClientDateAndTime', () => {
    it('should return client date and time', () => {
      const result = getClientDateAndTime(timezone, date);
      expect(result).toBe('30.06.2022 18:45:43 (+0)');
    });
  });
});
