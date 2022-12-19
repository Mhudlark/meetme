import { PreferenceSelection } from '../preferenceSelection';
import { Time24 } from '../time24';

describe('Schedulor selection class', () => {
  describe('addSelectionRange', () => {
    it('add range to empty selection', () => {
      const schedulorSelection = new PreferenceSelection(new Date(), [], 1);

      const newRange = {
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(17),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(1);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual(newRange);
    });

    it('add range that encompasses current selection range', () => {
      const schedulorSelection = new PreferenceSelection(
        new Date(),
        Time24.fromNumber(10),
        Time24.fromNumber(16),
        1
      );

      const newRange = {
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(17),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(1);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual(newRange);
    });

    it('add range that encompasses current selection ranges', () => {
      const schedulorSelection = new PreferenceSelection(
        new Date(),
        [
          {
            startTime: Time24.fromNumber(10),
            endTime: Time24.fromNumber(12),
          },
          {
            startTime: Time24.fromNumber(14),
            endTime: Time24.fromNumber(16),
          },
        ],
        1
      );

      const newRange = {
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(17),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(1);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual(newRange);
    });

    it('add range that is smaller than current selection range', () => {
      const expectedRange = {
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(17),
      };

      const schedulorSelection = new PreferenceSelection(
        new Date(),
        [expectedRange],
        1
      );

      const newRange = {
        startTime: Time24.fromNumber(10),
        endTime: Time24.fromNumber(16),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(1);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual(
        expectedRange
      );
    });

    it('add range that is smaller than one of current selection ranges', () => {
      const ranges = [
        {
          startTime: Time24.fromNumber(9),
          endTime: Time24.fromNumber(17),
        },
        {
          startTime: Time24.fromNumber(18),
          endTime: Time24.fromNumber(23),
        },
      ];

      const schedulorSelection = new PreferenceSelection(new Date(), ranges, 1);

      const newRange = {
        startTime: Time24.fromNumber(10),
        endTime: Time24.fromNumber(16),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(2);
      expect(schedulorSelection.selectionIntervalRanges).toEqual(ranges);
    });

    it('add range that does not overlap with one of current selection ranges', () => {
      const ranges = [
        {
          startTime: Time24.fromNumber(9),
          endTime: Time24.fromNumber(12),
        },
        {
          startTime: Time24.fromNumber(20),
          endTime: Time24.fromNumber(23),
        },
      ];

      const schedulorSelection = new PreferenceSelection(new Date(), ranges, 1);

      const newRange = {
        startTime: Time24.fromNumber(14),
        endTime: Time24.fromNumber(17),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(3);
      expect(schedulorSelection.selectionIntervalRanges[1]).toEqual(newRange);
    });

    it('add range that overlaps with start of one of current selection ranges', () => {
      const ranges = [
        {
          startTime: Time24.fromNumber(9),
          endTime: Time24.fromNumber(17),
        },
        {
          startTime: Time24.fromNumber(18),
          endTime: Time24.fromNumber(23),
        },
      ];

      const schedulorSelection = new PreferenceSelection(new Date(), ranges, 1);

      const newRange = {
        startTime: Time24.fromNumber(7),
        endTime: Time24.fromNumber(12),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(2);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual({
        startTime: Time24.fromNumber(7),
        endTime: Time24.fromNumber(17),
      });
    });

    it('add range that overlaps with end of one of current selection ranges', () => {
      const ranges = [
        {
          startTime: Time24.fromNumber(9),
          endTime: Time24.fromNumber(12),
        },
        {
          startTime: Time24.fromNumber(20),
          endTime: Time24.fromNumber(23),
        },
      ];

      const schedulorSelection = new PreferenceSelection(new Date(), ranges, 1);

      const newRange = {
        startTime: Time24.fromNumber(10),
        endTime: Time24.fromNumber(15),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(2);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual({
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(15),
      });
    });

    it('add range that overlaps multiple current selection ranges', () => {
      const ranges = [
        {
          startTime: Time24.fromNumber(9),
          endTime: Time24.fromNumber(17),
        },
        {
          startTime: Time24.fromNumber(18),
          endTime: Time24.fromNumber(23),
        },
      ];

      const schedulorSelection = new PreferenceSelection(new Date(), ranges, 1);

      const newRange = {
        startTime: Time24.fromNumber(10),
        endTime: Time24.fromNumber(20),
      };

      schedulorSelection.addSelectionRange(
        newRange.startTime,
        newRange.endTime
      );

      expect(schedulorSelection.selectionIntervalRanges.length).toEqual(1);
      expect(schedulorSelection.selectionIntervalRanges[0]).toEqual({
        startTime: Time24.fromNumber(9),
        endTime: Time24.fromNumber(23),
      });
    });
  });
});
