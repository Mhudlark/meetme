import { isSameDay } from 'date-fns';

import { SelectionInterval } from '@/types/selectionInterval';
import type { Time24 } from '@/types/time24';
import { getTimeRange } from '@/types/time24';

import { add } from '../math';

/**
 * Returns the smallest interval size from the selection intervals
 * @param selectionIntervals The selection intervals
 */
const getMinIntervalSizeFromSelectionIntervals = (
  selectionIntervals: SelectionInterval[]
): number => {
  if (selectionIntervals.length === 0)
    throw new Error('The selection intervals array is empty');

  const minIntervalSize = selectionIntervals.reduce(
    (currentMinIntervalSize, selectionInterval) =>
      selectionInterval.intervalSize < currentMinIntervalSize
        ? selectionInterval.intervalSize
        : currentMinIntervalSize,
    selectionIntervals?.[0]?.intervalSize as number
  );

  return minIntervalSize;
};

/**
 * Gets the date from the selection intervals.
 * Throws an error if the selection intervals are on different days.
 * @param selectionIntervals
 * @returns The date
 */
const getDateFromSelectionIntervals = (
  selectionIntervals: SelectionInterval[]
): Date => {
  if (selectionIntervals.length === 0)
    throw new Error('The selection intervals array is empty');

  const date = selectionIntervals?.[0]?.date as Date;

  selectionIntervals.forEach((selectionInterval) => {
    if (!isSameDay(date, selectionInterval.date))
      throw new Error('Cannot compare selection intervals on different days');
  });

  return date;
};

/**
 * Returns the smallest min time from the selection intervals
 * @param selectionIntervals The selection intervals
 */
const getMinTimeFromSelectionIntervals = (
  selectionIntervals: SelectionInterval[]
): Time24 => {
  if (selectionIntervals.length === 0)
    throw new Error('The selection intervals array is empty');

  const minTime = selectionIntervals.reduce(
    (currentMinTime, selectionInterval) =>
      selectionInterval.startTime.getMinTime(currentMinTime),
    selectionIntervals?.[0]?.startTime as Time24
  );

  return minTime;
};

/**
 * Returns the largest max time from the selection intervals
 * @param selectionIntervals The selection intervals
 */
const getMaxTimeFromSelectionIntervals = (
  selectionIntervals: SelectionInterval[]
): Time24 => {
  if (selectionIntervals.length === 0)
    throw new Error('The selection intervals array is empty');

  const maxTime = selectionIntervals.reduce(
    (currentMaxTime, selectionInterval) =>
      selectionInterval.endTime.getMaxTime(currentMaxTime),
    selectionIntervals?.[0]?.endTime as Time24
  );

  return maxTime;
};

/**
 * Merges two selection interval ranges into one by setting the count of the each interval
 * to be the result of the mergeCountFunction (e.g. add, subtract, max, etc.)
 * @param interval The first selection interval
 * @param otherInterval The second selection interval
 * @param mergeCountFunction The function to merge the count of the two intervals
 * @returns The merged selection interval
 * @throws Error if the selection intervals are not on the same day, have different start times,
 * or different interval sizes
 */
export const mergeSelectionIntervalsCount = (
  interval: SelectionInterval,
  otherInterval: SelectionInterval,
  mergeCountFunction: (count: number, otherCount: number) => number
): SelectionInterval => {
  if (!isSameDay(interval.date, otherInterval.date)) {
    throw new Error(`Cannot merge selection intervals on different days: 
    ${interval.date.toString()} and ${otherInterval.date.toString()}`);
  }
  if (!interval.startTime.equals(otherInterval.startTime)) {
    throw new Error(
      `Cannot merge selection intervals with different start times: 
      ${interval.startTime.toString()} and ${otherInterval.startTime.toString()}`
    );
  }
  if (interval.intervalSize !== otherInterval.intervalSize) {
    throw new Error(
      `Cannot merge selection intervals with different interval 
      sizes: ${interval.intervalSize} and ${otherInterval.intervalSize}`
    );
  }

  return new SelectionInterval(
    interval.date,
    interval.startTime,
    interval.intervalSize,
    mergeCountFunction(interval.count, otherInterval.count)
  );
};

/**
 * Merges two chronologically adjacent selection intervals into one
 * @param firstInterval The first selection interval (earlier)
 * @param secondInterval The second selection interval (later)
 * @returns The merged selection interval
 * @throws Error if the selection intervals are not on the same day,
 * are not chronologically adjacent, have different interval sizes,
 * or have different counts (if allowDifferentCounts is false)
 */
export const mergeAdjacentSelectionIntervals = (
  firstInterval: SelectionInterval,
  secondInterval: SelectionInterval,
  allowDifferentCounts = false
): SelectionInterval => {
  if (!isSameDay(firstInterval.date, secondInterval.date)) {
    throw new Error(`Cannot merge selection intervals on different days: 
    ${firstInterval.date.toString()} and ${secondInterval.date.toString()}`);
  }
  if (!firstInterval.endTime.equals(secondInterval.startTime)) {
    throw new Error(
      `Cannot merge non-adjacent selection intervals: 
      ${firstInterval.endTime.toString()} and ${secondInterval.startTime.toString()}`
    );
  }
  if (firstInterval.intervalSize !== secondInterval.intervalSize) {
    throw new Error(
      `Cannot merge selection intervals with different interval 
      sizes: ${firstInterval.intervalSize} and ${secondInterval.intervalSize}`
    );
  }
  if (firstInterval.count !== secondInterval.count && !allowDifferentCounts) {
    throw new Error(
      `Cannot merge selection intervals with different counts: 
      ${firstInterval.count} and ${secondInterval.count}`
    );
  }

  return new SelectionInterval(
    firstInterval.date,
    firstInterval.startTime,
    secondInterval.endTime,
    firstInterval.intervalSize,
    firstInterval.count
  );
};

/**
 * Creates an array of selection intervals between a min and max time for a given date
 * that are not selected
 * @param date The date
 * @param minTime The min time
 * @param maxTime The max time
 * @param intervalSize The interval size in hours
 */
export const getSelectionIntervalRange = (
  date: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
) => {
  const intervalsStartTimes = getTimeRange(minTime, maxTime, intervalSize);

  const selectionIntervalRange: SelectionInterval[] = intervalsStartTimes.map(
    (intervalStartTime) =>
      new SelectionInterval(date, intervalStartTime, intervalSize, 0)
  );

  return selectionIntervalRange;
};

/**
 * Reduces the selection intervals into the minimum number of ranges.
 * Presumes the selection intervals are ordered by start time.
 * @param selectionIntervals The selection ranges
 * @param allowDifferentCounts Whether to allow different counts in adjacent intervals.
 * Used when removing blank intervals only.
 * @returns A minified, ordered version of the selection ranges
 */
const reduceSelectionIntervals = (
  selectionIntervals: SelectionInterval[],
  allowDifferentCounts: boolean = false
): SelectionInterval[] => {
  if (selectionIntervals.length <= 1) return selectionIntervals;

  const reducedSelectionIntervals = [];
  let currentSelectionInterval: null | SelectionInterval = null;
  for (let i = 0; i < selectionIntervals.length; i += 1) {
    const nextSelectionInterval = selectionIntervals[i] as SelectionInterval;

    // If no current selection interval, try and set it to next interval
    if (currentSelectionInterval === null) {
      if (nextSelectionInterval.count > 0)
        currentSelectionInterval = nextSelectionInterval;
    }
    // If next interval is blank, push current interval and reset
    else if (nextSelectionInterval.count === 0) {
      reducedSelectionIntervals.push(currentSelectionInterval);
      currentSelectionInterval = null;
    }
    // If next interval is adjacent and has same count, merge
    else if (
      currentSelectionInterval.isAdjacentTo(nextSelectionInterval) &&
      (currentSelectionInterval.count === nextSelectionInterval.count ||
        allowDifferentCounts)
    ) {
      currentSelectionInterval = mergeAdjacentSelectionIntervals(
        currentSelectionInterval,
        nextSelectionInterval,
        allowDifferentCounts
      );
    }
    // If next interval is not adjacent or has different count,
    // push current interval and set next interval
    else {
      reducedSelectionIntervals.push(currentSelectionInterval);
      currentSelectionInterval = nextSelectionInterval;
    }
  }

  reducedSelectionIntervals.push(currentSelectionInterval);

  return reducedSelectionIntervals as SelectionInterval[];
};

/**
 * Merges two selection interval ranges into one by setting the count of the each interval
 * in the larger range to the max count of each interval pair.
 * @param firstIntervals The larger interval range
 * @param secondIntervals The smaller interval range
 * @param mergeCountFunction The function to use to merge the counts
 * @param mergeIntervalsWithDifferentCounts Whether to merge intervals with different counts.
 * Defaults to true.
 * Used when count does not matter, only whether intervals are included or not
 * @returns The merged interval
 */
export const mergeSelectionIntervals = (
  firstIntervals: SelectionInterval[],
  secondIntervals: SelectionInterval[],
  mergeCountFunction: (count: number, otherCount: number) => number,
  mergeIntervalsWithDifferentCounts: boolean = true
): SelectionInterval[] => {
  const date = getDateFromSelectionIntervals([
    ...firstIntervals,
    ...secondIntervals,
  ]);
  const minTime = getMinTimeFromSelectionIntervals([
    ...firstIntervals,
    ...secondIntervals,
  ]);
  const maxTime = getMaxTimeFromSelectionIntervals([
    ...firstIntervals,
    ...secondIntervals,
  ]);
  const minIntervalSize = getMinIntervalSizeFromSelectionIntervals([
    ...firstIntervals,
    ...secondIntervals,
  ]);

  // Create new blank selection interval range that is combination of the two
  const maxPossibleSelectionIntervals = getSelectionIntervalRange(
    date,
    minTime,
    maxTime,
    minIntervalSize
  );

  // Merge the first interval range into the blank interval range
  firstIntervals.forEach((interval) => {
    // Iterate over each interval in the blank interval range
    // (which has min intervalSize) and merge the count of any
    // blank interval that is in the first interval range
    maxPossibleSelectionIntervals.forEach((maxInterval, index) => {
      if (maxInterval.isEncompassedBy(interval)) {
        maxPossibleSelectionIntervals[index] = maxInterval.copyWithCount(
          mergeCountFunction(interval.count, maxInterval.count)
        );
      }
    });
  });

  // Merge the first interval range into the blank interval range
  secondIntervals.forEach((interval) => {
    // Iterate over each interval in the blank interval range
    // (which has min intervalSize) and merge the count of any
    // blank interval that is in the second interval range
    maxPossibleSelectionIntervals.forEach((maxInterval, index) => {
      if (maxInterval.isEncompassedBy(interval)) {
        maxPossibleSelectionIntervals[index] = maxInterval.copyWithCount(
          mergeCountFunction(interval.count, maxInterval.count)
        );
      }
    });
  });

  const reducedSelectionIntervals = reduceSelectionIntervals(
    maxPossibleSelectionIntervals,
    mergeIntervalsWithDifferentCounts
  );

  return reducedSelectionIntervals;
};

/**
 * Removes the selection interval from the selection intervals.
 * Sets the count of the selection interval to 0.
 * @param selectionIntervals The selection intervals
 * @param intervalToRemove The selection interval to remove
 * @returns The selection intervals with the selection interval removed
 */
export const removeIntervalFromIntervals = (
  selectionIntervals: SelectionInterval[],
  intervalToRemove: SelectionInterval
): SelectionInterval[] => {
  const newIntervals = [...selectionIntervals];

  newIntervals.forEach((interval, index) => {
    if (
      intervalToRemove.endTime.isGreaterThan(interval.startTime) &&
      intervalToRemove.startTime.isLessThanOrEqual(interval.startTime)
    ) {
      const intervalPointer = newIntervals?.[index];
      if (intervalPointer) intervalPointer.count = 0;
    }
  });

  return newIntervals;
};

/**
 * Adds the selection interval to the selection intervals.
 * @param selectionIntervals The selection intervals
 * @param intervalToAdd The selection interval to add
 * @param mergeIntervalsWithDifferentCounts Whether to allow different counts in adjacent intervals.
 * @returns
 */
export const addIntervalToIntervals = (
  selectionIntervals: SelectionInterval[],
  intervalToAdd: SelectionInterval,
  mergeIntervalsWithDifferentCounts: boolean = true
): SelectionInterval[] => {
  return mergeSelectionIntervals(
    selectionIntervals,
    [intervalToAdd],
    add,
    mergeIntervalsWithDifferentCounts
  );
};
