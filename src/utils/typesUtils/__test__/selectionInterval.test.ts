import { SelectionInterval } from '@/types/selectionInterval';
import { Time24 } from '@/types/time24';

import {
  getDateFromSelectionIntervals,
  getMinIntervalSizeFromSelectionIntervals,
  reduceSelectionIntervals,
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

  describe('reduceSelectionIntervals', () => {
    it('Removes blank intervals', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, []),
        new SelectionInterval(mockDate, new Time24(12), new Time24(13), 2, []),
      ];

      const reducedIntervals = reduceSelectionIntervals(intervals);

      expect(reducedIntervals.length).toEqual(0);
    });

    it('Removes blank intervals intermixed with selected intervals', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(9), new Time24(10), 1, [
          'test',
        ]),
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, []),
        new SelectionInterval(mockDate, new Time24(11), new Time24(12), 1, [
          'test',
        ]),
        new SelectionInterval(mockDate, new Time24(12), new Time24(13), 1, []),
      ];

      const reducedIntervals = reduceSelectionIntervals(intervals);

      expect(reducedIntervals.length).toEqual(2);
    });

    it('Combines selected intervals with same ids', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(9), new Time24(10), 1, [
          'test',
        ]),
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, [
          'test',
        ]),
        new SelectionInterval(mockDate, new Time24(11), new Time24(12), 1, [
          'test',
        ]),
      ];

      const reducedIntervals = reduceSelectionIntervals(intervals);

      expect(reducedIntervals.length).toEqual(1);
    });

    it('Does not combine selected intervals with different ids', () => {
      const firstInterval = new SelectionInterval(
        mockDate,
        new Time24(9),
        new Time24(10),
        1,
        ['test']
      );

      const intervals = [
        firstInterval,
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, [
          'test-different',
        ]),
        new SelectionInterval(mockDate, new Time24(11), new Time24(12), 1, [
          'test',
        ]),
      ];

      const reducedIntervals = reduceSelectionIntervals(intervals);

      expect(reducedIntervals.length).toEqual(3);
      expect(reducedIntervals?.[0]).toEqual(firstInterval);
    });
  });
});
