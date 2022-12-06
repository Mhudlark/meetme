import { addDays } from 'date-fns';

import { formatDateToFriendlyString, getDateRange } from '../date';

describe('Date utils', () => {
  describe('getDateRange', () => {
    it('Generates the correct date range', () => {
      const numDays = 5;

      const startDate = new Date(Date.UTC(2020, 0, 1));
      const endDate = addDays(startDate, numDays);

      const dateRange = getDateRange(startDate, endDate);

      expect(dateRange.length).toEqual(numDays);
      expect(dateRange[0]).toEqual(startDate);
      expect(dateRange[dateRange.length - 1]).toEqual(addDays(endDate, -1));
    });

    it('Includes the end date in the date range', () => {
      const numDays = 5;

      const startDate = new Date(Date.UTC(2020, 0, 1));
      const endDate = addDays(startDate, numDays);

      const dateRange = getDateRange(startDate, endDate, true);

      expect(dateRange.length).toEqual(numDays + 1);
      expect(dateRange[0]).toEqual(startDate);
      expect(dateRange[dateRange.length - 1]).toEqual(endDate);
    });
  });

  describe('formatDateToFriendlyString', () => {
    it('Correctly formats the dates', () => {
      const date1 = new Date(Date.UTC(2022, 11, 1));
      const date2 = new Date(Date.UTC(2022, 4, 31));
      const date3 = new Date(Date.UTC(2023, 0, 1));

      const dateStr1 = formatDateToFriendlyString(date1);
      const dateStr2 = formatDateToFriendlyString(date2);
      const dateStr3 = formatDateToFriendlyString(date3);

      expect(dateStr1).toEqual('Thursday 1st Dec, 2022');
      expect(dateStr2).toEqual('Tuesday 31st May, 2022');
      expect(dateStr3).toEqual('Sunday 1st Jan, 2023');
    });
  });
});
