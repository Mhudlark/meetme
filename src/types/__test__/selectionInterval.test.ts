import { SelectionInterval } from '../selectionInterval';
import { Time24 } from '../time24';

const mockDate = new Date();
const mockUserId = 'mockUserId';

describe('Selection Interval class', () => {
  describe('constructor', () => {
    it('first constructor', () => {
      const startTime = Time24.fromNumber(9);
      const endTime = Time24.fromNumber(10);
      const intervalSize = 1;

      const selectionInterval = new SelectionInterval(
        mockDate,
        startTime,
        intervalSize,
        [mockUserId]
      );

      expect(selectionInterval.date).toEqual(mockDate);
      expect(selectionInterval.startTime).toEqual(startTime);
      expect(selectionInterval.endTime).toEqual(endTime);
      expect(selectionInterval.intervalSize).toEqual(intervalSize);
      expect(selectionInterval.userIds).toEqual([mockUserId]);
    });

    it('second constructor', () => {
      const startTime = Time24.fromNumber(9);
      const endTime = Time24.fromNumber(17);
      const intervalSize = 1;

      const selectionInterval = new SelectionInterval(
        mockDate,
        startTime,
        endTime,
        intervalSize,
        [mockUserId]
      );

      expect(selectionInterval.date).toEqual(mockDate);
      expect(selectionInterval.startTime).toEqual(startTime);
      expect(selectionInterval.endTime).toEqual(endTime);
      expect(selectionInterval.intervalSize).toEqual(intervalSize);
      expect(selectionInterval.userIds).toEqual([mockUserId]);
    });
  });
});
