import { PreferenceSelection } from '../preferenceSelection';
import { SelectionInterval } from '../selectionInterval';
import { Time24 } from '../time24';

const mockDate = new Date();
const mockUserId = 'mockUserId';
const mockSecondUserId = 'mockSecondUserId';

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

describe('Schedulor selection class', () => {
  describe('addSelectionRange', () => {
    it('add range to empty selection', () => {
      const preferenceIntervalSize = 1;
      const preferenceSelection = new PreferenceSelection(
        mockDate,
        [],
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(9, 17, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(1);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(newInterval);
    });

    it('add range that encompasses current selection range', () => {
      const preferenceIntervalSize = 1;
      const preferenceSelection = new PreferenceSelection(
        mockDate,
        Time24.fromNumber(10),
        Time24.fromNumber(16),
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(9, 17, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(1);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(newInterval);
    });

    it('add range that encompasses current selection ranges', () => {
      const preferenceIntervalSize = 1;
      const preferenceSelection = new PreferenceSelection(
        mockDate,
        [
          mockSelectionInterval(10, 12, preferenceIntervalSize),
          mockSelectionInterval(14, 16, preferenceIntervalSize),
        ],
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(9, 17, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(1);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(newInterval);
    });

    it('add range that is smaller than current selection range', () => {
      const preferenceIntervalSize = 1;

      const expectedInterval = mockSelectionInterval(
        9,
        17,
        preferenceIntervalSize
      );

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        [expectedInterval],
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(10, 16, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(1);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(
        expectedInterval
      );
    });

    it('add range that is smaller than one of current selection ranges', () => {
      const preferenceIntervalSize = 1;

      const initialIntervals = [
        mockSelectionInterval(9, 17, preferenceIntervalSize),
        mockSelectionInterval(18, 23, preferenceIntervalSize),
      ];

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        initialIntervals,
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(10, 16, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(2);
      expect(preferenceSelection.selectionIntervals).toEqual(initialIntervals);
    });

    it('add range that does not overlap with one of current selection ranges', () => {
      const preferenceIntervalSize = 1;

      const initialIntervals = [
        mockSelectionInterval(9, 12, preferenceIntervalSize),
        mockSelectionInterval(20, 23, preferenceIntervalSize),
      ];

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        initialIntervals,
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(14, 17, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      expect(preferenceSelection.selectionIntervals.length).toEqual(3);
      expect(preferenceSelection.selectionIntervals[1]).toEqual(newInterval);
    });

    it('add range that overlaps with start of one of current selection ranges', () => {
      const preferenceIntervalSize = 1;

      const initialIntervals = [
        mockSelectionInterval(9, 17, preferenceIntervalSize),
        mockSelectionInterval(18, 23, preferenceIntervalSize),
      ];

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        initialIntervals,
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(7, 12, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      const expectedInterval = mockSelectionInterval(
        7,
        17,
        preferenceIntervalSize
      );

      expect(preferenceSelection.selectionIntervals.length).toEqual(2);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(
        expectedInterval
      );
    });

    it('add range that overlaps with end of one of current selection ranges', () => {
      const preferenceIntervalSize = 1;

      const initialIntervals = [
        mockSelectionInterval(9, 12, preferenceIntervalSize),
        mockSelectionInterval(20, 23, preferenceIntervalSize),
      ];

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        initialIntervals,
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(10, 15, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      const expectedInterval = mockSelectionInterval(
        9,
        15,
        preferenceIntervalSize
      );

      expect(preferenceSelection.selectionIntervals.length).toEqual(2);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(
        expectedInterval
      );
    });

    it('add range that overlaps multiple current selection ranges', () => {
      const preferenceIntervalSize = 1;

      const initialIntervals = [
        mockSelectionInterval(9, 17, preferenceIntervalSize),
        mockSelectionInterval(18, 23, preferenceIntervalSize),
      ];

      const preferenceSelection = new PreferenceSelection(
        mockDate,
        initialIntervals,
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(10, 20, preferenceIntervalSize);

      preferenceSelection.addSelectionInterval(newInterval);

      const expectedInterval = mockSelectionInterval(
        9,
        23,
        preferenceIntervalSize
      );

      expect(preferenceSelection.selectionIntervals.length).toEqual(1);
      expect(preferenceSelection.selectionIntervals[0]).toEqual(
        expectedInterval
      );
    });

    it('add range with different userId that encompasses current selection range', () => {
      const preferenceIntervalSize = 1;
      const preferenceSelection = new PreferenceSelection(
        mockDate,
        Time24.fromNumber(10),
        Time24.fromNumber(16),
        preferenceIntervalSize,
        mockUserId
      );

      const newInterval = mockSelectionInterval(9, 17, preferenceIntervalSize, [
        mockSecondUserId,
      ]);

      preferenceSelection.addSelectionInterval(newInterval);

      const expectedIntervals = [
        mockSelectionInterval(9, 10, preferenceIntervalSize, [
          mockSecondUserId,
        ]),
        mockSelectionInterval(10, 16, preferenceIntervalSize, [
          mockUserId,
          mockSecondUserId,
        ]),
        mockSelectionInterval(16, 17, preferenceIntervalSize, [
          mockSecondUserId,
        ]),
      ];

      expect(preferenceSelection.selectionIntervals.length).toEqual(3);
      expect(preferenceSelection.selectionIntervals).toEqual(expectedIntervals);
    });
  });
});
