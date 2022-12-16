import type {
  SelectableIntervals,
  SelectionIntervalRange,
} from '@/sharedTypes';
import type { Time24 } from '@/types/time24';
import { getTimeRange } from '@/types/time24';

/**
 * Returns the smallest min time from the selection ranges
 * @param selectionRanges The selection ranges
 */
const getMinTimeFromSelectionRanges = (
  selectionRanges: SelectionIntervalRange[]
): Time24 => {
  if (selectionRanges.length === 0)
    throw new Error('The selection ranges array is empty');

  const minTime = selectionRanges.reduce(
    (currentMinTime, selectionRange) =>
      selectionRange.startTime.getMinTime(currentMinTime),
    selectionRanges?.[0]?.startTime as Time24
  );

  return minTime;
};

/**
 * Returns the largest max time from the selection ranges
 * @param selectionRanges The selection ranges
 */
const getMaxTimeFromSelectionRanges = (
  selectionRanges: SelectionIntervalRange[]
): Time24 => {
  if (selectionRanges.length === 0)
    throw new Error('The selection ranges array is empty');

  const maxTime = selectionRanges.reduce(
    (currentMaxTime, selectionRange) =>
      selectionRange.endTime.getMaxTime(currentMaxTime),
    selectionRanges?.[0]?.endTime as Time24
  );

  return maxTime;
};

/**
 * Creates an array of intervals with the selected property set to true
 * if the interval is included in the selection ranges
 * By default, the included property is set to false
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 */
export const initSelectableIntervals = (
  selectionRanges: SelectionIntervalRange[],
  intervalSize: number
): SelectableIntervals => {
  const intervalsStartTimes = getTimeRange(
    getMinTimeFromSelectionRanges(selectionRanges),
    getMaxTimeFromSelectionRanges(selectionRanges),
    intervalSize
  );

  const selectableIntervals: SelectableIntervals = intervalsStartTimes.map(
    (intervalStartTime) => ({
      startTime: intervalStartTime,
      selected: false,
    })
  );

  return selectableIntervals;
};

/**
 * Fills the selectable intervals array with the selection ranges
 * Interval.included is set to true if the interval is selected in the selection ranges
 * @param selectableIntervals The selectable intervals
 * @param selectionRanges The selection ranges
 */
export const fillSelectableIntervals = (
  selectableIntervals: SelectableIntervals,
  selectionRanges: SelectionIntervalRange[]
): SelectableIntervals => {
  const selectableIntervalsCopy = [...selectableIntervals];

  selectionRanges.forEach((selectionRange) => {
    selectableIntervalsCopy.forEach((interval, index) => {
      if (
        selectionRange.startTime.isLessThanOrEqual(interval.startTime) &&
        selectionRange.endTime.isGreaterThan(interval.startTime)
      ) {
        const intervalPointer = selectableIntervalsCopy?.[index];
        if (intervalPointer) intervalPointer.selected = true;
      }
    });
  });

  return selectableIntervalsCopy;
};

/**
 * Creates a selectable intervals array from the selection ranges
 * Interval.included is set to true if the interval is selected in the selection ranges
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 */
const calculateSelectableIntervals = (
  selectionRanges: SelectionIntervalRange[],
  intervalSize: number
): SelectableIntervals => {
  const selectableIntervals = initSelectableIntervals(
    selectionRanges,
    intervalSize
  );

  return fillSelectableIntervals(selectableIntervals, selectionRanges);
};

const removeRangeFromSelectableIntervals = (
  selectableIntervals: SelectableIntervals,
  rangeToRemove: SelectionIntervalRange
): SelectableIntervals => {
  const newSelectableIntervals = [...selectableIntervals];

  newSelectableIntervals.forEach((interval, index) => {
    if (
      rangeToRemove.startTime.isLessThanOrEqual(interval.startTime) &&
      rangeToRemove.endTime.isGreaterThan(interval.startTime)
    ) {
      const intervalPointer = newSelectableIntervals?.[index];
      if (intervalPointer) intervalPointer.selected = false;
    }
  });

  return newSelectableIntervals;
};

/**
 * Calculates a new selection ranges array from the selectable intervals array
 * @param selectableIntervals The selectable intervals
 * @param intervalSize The interval size in hours
 * @returns A new selection ranges array
 */
const getSelectionRangesFromSelectableIntervals = (
  selectableIntervals: SelectableIntervals,
  intervalSize: number
): SelectionIntervalRange[] => {
  const selectionRanges: SelectionIntervalRange[] = [];
  let currentRange: SelectionIntervalRange | null = null;

  selectableIntervals.forEach((interval) => {
    if (interval.selected) {
      if (!currentRange) {
        currentRange = {
          startTime: interval.startTime,
          endTime: interval.startTime.addTime(intervalSize),
        };
      } else {
        currentRange.endTime = interval.startTime.addTime(intervalSize);
      }
    } else if (currentRange) {
      selectionRanges.push(currentRange);
      currentRange = null;
    }
  });

  if (currentRange) selectionRanges.push(currentRange);

  return selectionRanges;
};

/**
 * Reduces the selection ranges into the minimum number of ranges.
 * Also, sorts the ranges by start time
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 * @returns A minified, ordered version of the selection ranges
 */
export const reduceSelectionRanges = (
  selectionRanges: SelectionIntervalRange[],
  intervalSize: number
) => {
  const selectableIntervals = calculateSelectableIntervals(
    selectionRanges,
    intervalSize
  );

  return getSelectionRangesFromSelectableIntervals(
    selectableIntervals,
    intervalSize
  );
};

/**
 * Removes the range from the selection ranges array and reduces it to the minimum number of ranges
 * @param selectionRanges The selection ranges
 * @param selectionRangeToRemove The selection range to remove
 * @param intervalSize The interval size in hours
 * @returns A minified, ordered version of the selection ranges
 */
export const removeSelectionRangeFromSelectionRanges = (
  selectionRanges: SelectionIntervalRange[],
  selectionRangeToRemove: SelectionIntervalRange,
  intervalSize: number
): SelectionIntervalRange[] => {
  const selectableIntervals = calculateSelectableIntervals(
    selectionRanges,
    intervalSize
  );

  const selectableIntervalsWithoutRange = removeRangeFromSelectableIntervals(
    selectableIntervals,
    selectionRangeToRemove
  );

  return getSelectionRangesFromSelectableIntervals(
    selectableIntervalsWithoutRange,
    intervalSize
  );
};
