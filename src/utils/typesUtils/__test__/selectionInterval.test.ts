import { SelectionInterval } from '@/types/selectionInterval';
import { Time24 } from '@/types/time24';

import {
  getDateFromSelectionIntervals,
  getMinIntervalSizeFromSelectionIntervals,
} from '../selectionInterval';

const mockDate = new Date();

describe('selectionInterval utils', () => {
  describe('getMinIntervalSizeFromSelectionIntervals', () => {
    it('Test', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, []),
        new SelectionInterval(mockDate, new Time24(12), new Time24(13), 2, []),
      ];

      const minIntervalSize =
        getMinIntervalSizeFromSelectionIntervals(intervals);

      expect(minIntervalSize).toEqual(1);
    });
  });

  describe('getDateFromSelectionIntervals', () => {
    it('Test', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, []),
        new SelectionInterval(mockDate, new Time24(12), new Time24(13), 2, []),
      ];

      const date = getDateFromSelectionIntervals(intervals);

      expect(date).toEqual(mockDate);
    });
  });
});
