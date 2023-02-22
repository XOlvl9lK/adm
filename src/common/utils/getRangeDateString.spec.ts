import { TestHelpers } from '@common/test/testHelpers';
import { getRangeDateString } from '@common/utils/getRangeDateString';
import { format } from 'date-fns';

const helpers = new TestHelpers().getHelpers();

describe('getRangeDateString', () => {
  test('Should return date range in correct format', () => {
    const result = getRangeDateString(helpers.random.date, helpers.random.date);

    expect(result).toBe(format(helpers.random.date, 'dd.MM.yyyy') + ' - ' + format(helpers.random.date, 'dd.MM.yyyy'));
  });
});
