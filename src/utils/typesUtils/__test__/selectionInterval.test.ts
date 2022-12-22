import { SelectionInterval } from '@/types/selectionInterval';
import { Time24 } from '@/types/time24';

import {
  getDateFromSelectionIntervals,
  getMinIntervalSizeFromSelectionIntervals,
  getSelectedIntervalsForTimeRange,
  reduceSelectionIntervals,
} from '../selectionInterval';

const mockDate = new Date();
const mockUserId = 'mockUserId';

const mockSelectionInterval = (
  startTime: number,
  endTime: number,
  intervalSize: number = 1,
  userIds: string[] = [mockUserId]
) => {
  return new SelectionInterval(
    mockDate,
    Time24.fromNumber(startTime),
    Time24.fromNumber(endTime),
    intervalSize,
    userIds
  );
};

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
    it('Removes blank interval', () => {
      const intervals = [
        new SelectionInterval(mockDate, new Time24(10), new Time24(11), 1, []),
      ];

      const reducedIntervals = reduceSelectionIntervals(intervals);

      expect(reducedIntervals.length).toEqual(0);
    });

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

  describe('getSelectedIntervalsForTimeRange', () => {
    it('Test', () => {
      const selectedIntervals = [mockSelectionInterval(10, 14)];

      const maxIntervals = getSelectedIntervalsForTimeRange(
        selectedIntervals,
        mockDate,
        1,
        Time24.fromNumber(9),
        Time24.fromNumber(16)
      );

      const expectedIntervals: SelectionInterval[] = [
        mockSelectionInterval(9, 10, 1, []),
        mockSelectionInterval(10, 11),
        mockSelectionInterval(11, 12),
        mockSelectionInterval(12, 13),
        mockSelectionInterval(13, 14),
        mockSelectionInterval(14, 15, 1, []),
        mockSelectionInterval(15, 16, 1, []),
      ];

      expect(maxIntervals.length).toEqual(expectedIntervals.length);
      expect(maxIntervals).toEqual(expectedIntervals);
    });
  });
});
