import { isSameDay } from 'date-fns';
import { uniq } from 'lodash';

import { SelectionInterval } from '@/types/selectionInterval';
import type { Time24 } from '@/types/time24';
import { getTimeRange } from '@/types/time24';

/**
 * Returns the smallest interval size from the selection intervals
 * @param selectionIntervals The selection intervals
 */
export const getMinIntervalSizeFromSelectionIntervals = (
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
export const getDateFromSelectionIntervals = (
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
export const getMinTimeFromSelectionIntervals = (
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
export const getMaxTimeFromSelectionIntervals = (
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
 * Merges two selection interval ranges into one by combining the user IDs.
 * Does not require selection intervals to have same user IDs
 * @param primaryInterval The selection interval that will be copied.
 * @param otherInterval The selection interval whose id's will be added
 * @returns The merged selection interval
 * @throws Error if the selection intervals are not on the same day
 */
const mergeSelectionIntervalsUserIds = (
  primaryInterval: SelectionInterval,
  otherInterval: SelectionInterval
): SelectionInterval => {
  if (!isSameDay(primaryInterval.date, otherInterval.date)) {
    throw new Error(`Cannot merge selection intervals on different days: 
    ${primaryInterval.date.toString()} and ${otherInterval.date.toString()}`);
  }

  return primaryInterval.copyWithUserIds(
    uniq([...primaryInterval.userIds, ...otherInterval.userIds])
  );
};

/**
 * Merges two chronologically adjacent selection intervals into one.
 * Requires that selection intervals have same user IDs.
 * @param firstInterval The first selection interval (earlier)
 * @param secondInterval The second selection interval (later)
 * @returns The merged selection interval
 * @throws Error if the selection intervals are not on the same day,
 * are not chronologically adjacent, have different interval sizes,
 * or have different user IDs
 */
const mergeAdjacentSelectionIntervals = (
  firstInterval: SelectionInterval,
  secondInterval: SelectionInterval
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
  if (!firstInterval.hasSameUserIds(secondInterval)) {
    throw new Error('Cannot merge selection intervals with different user IDs');
  }

  return new SelectionInterval(
    firstInterval.date,
    firstInterval.startTime,
    secondInterval.endTime,
    firstInterval.intervalSize,
    firstInterval.userIds
  );
};

/**
 * Reduces the selection intervals into the minimum number of selection intervals.
 * Presumes the selection intervals are ordered by start time.
 * @param selectionIntervals The selection intervals
 * @returns A minified version of the selection intervals
 */
export const reduceSelectionIntervals = (
  selectionIntervals: SelectionInterval[]
): SelectionInterval[] => {
  if (selectionIntervals.length === 0) return [];

  const reducedSelectionIntervals = [];
  let currentSelectionInterval: null | SelectionInterval = null;
  for (let i = 0; i < selectionIntervals.length; i += 1) {
    const nextSelectionInterval = selectionIntervals[i] as SelectionInterval;

    // If no current selection interval, try and set it to next interval
    if (currentSelectionInterval === null) {
      if (nextSelectionInterval.isSelected())
        currentSelectionInterval = nextSelectionInterval;
    }
    // If next interval is not selected, push current interval and reset
    else if (!nextSelectionInterval.isSelected()) {
      reducedSelectionIntervals.push(currentSelectionInterval);
      currentSelectionInterval = null;
    }
    // If next interval is adjacent and has same user ids, merge
    else if (
      currentSelectionInterval.isAdjacentTo(nextSelectionInterval) &&
      currentSelectionInterval.hasSameUserIds(nextSelectionInterval)
    ) {
      currentSelectionInterval = mergeAdjacentSelectionIntervals(
        currentSelectionInterval,
        nextSelectionInterval
      );
    }
    // If next interval is not adjacent or has different count,
    // push current interval and set next interval
    else {
      reducedSelectionIntervals.push(currentSelectionInterval);
      currentSelectionInterval = nextSelectionInterval;
    }
  }

  if (currentSelectionInterval !== null)
    reducedSelectionIntervals.push(currentSelectionInterval);

  return reducedSelectionIntervals as SelectionInterval[];
};

/**
 * Creates an array of selection intervals between a min and max time for a given date.
 * Defaults to being not selected.
 * @param date The date
 * @param minTime The min time
 * @param maxTime The max time
 * @param intervalSize The interval size in hours
 * @param userIds The user IDs. Defaults to empty.
 */
const getSelectionIntervalRange = (
  date: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number,
  userIds: string[] = []
): SelectionInterval[] => {
  const intervalsStartTimes = getTimeRange(minTime, maxTime, intervalSize);

  const selectionIntervalRange: SelectionInterval[] = intervalsStartTimes.map(
    (intervalStartTime) =>
      new SelectionInterval(date, intervalStartTime, intervalSize, userIds)
  );

  return selectionIntervalRange;
};

/**
 * Merges two selection interval ranges into one
 * @param firstIntervals The first interval range
 * @param secondIntervals The second interval range
 * @returns The merged interval range
 */
export const mergeSelectionIntervals = (
  firstIntervals: SelectionInterval[],
  secondIntervals: SelectionInterval[],
  reduce: boolean = true
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
    // (which has min intervalSize) and merge any blank
    // interval that is in the first interval range
    maxPossibleSelectionIntervals.forEach((maxInterval, index) => {
      if (maxInterval.isEncompassedBy(interval)) {
        maxPossibleSelectionIntervals[index] = mergeSelectionIntervalsUserIds(
          maxInterval,
          interval
        );
      }
    });
  });

  // Merge the first interval range into the blank interval range
  secondIntervals.forEach((interval) => {
    // Iterate over each interval in the blank interval range
    // (which has min intervalSize) and merge any blank
    // interval that is in the first interval range
    maxPossibleSelectionIntervals.forEach((maxInterval, index) => {
      if (maxInterval.isEncompassedBy(interval)) {
        maxPossibleSelectionIntervals[index] = mergeSelectionIntervalsUserIds(
          maxInterval,
          interval
        );
      }
    });
  });

  if (!reduce) return maxPossibleSelectionIntervals;

  const reducedSelectionIntervals = reduceSelectionIntervals(
    maxPossibleSelectionIntervals
  );
  return reducedSelectionIntervals;
};

/**
 * Returns an array of selection intervals between a min and max time for a given date.
 * Sets the output selection intervals to be selected if they are in the
 * input selection intervals.
 * @param selectionIntervals The input selection intervals
 * @param date The date
 * @param intervalSize The interval size in hours
 * @param minTime The min time
 * @param maxTime The max time
 * @returns The output selection intervals
 */
export const getSelectedIntervalsForTimeRange = (
  selectionIntervals: SelectionInterval[],
  date: Date,
  intervalSize: number,
  minTime: Time24,
  maxTime: Time24
): SelectionInterval[] => {
  const blankSelectionIntervals = getSelectionIntervalRange(
    date,
    minTime,
    maxTime,
    intervalSize
  );

  return mergeSelectionIntervals(blankSelectionIntervals, selectionIntervals);
};

/**
 * Removes the selection interval from the selection intervals.
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
    // Remove existing interval if it is encompassed by the interval to remove
    // r.start <= i.start < i.end <= r.end
    if (
      intervalToRemove.startTime.isLessThanOrEqual(interval.startTime) &&
      intervalToRemove.endTime.isGreaterThan(interval.endTime)
    ) {
      newIntervals[index] = interval.copyWithUserIds([]);
    }
    // Edit interval if it is overlapped at the start by the interval to remove
    // r.start <= i.start < r.end <= i.end
    else if (
      intervalToRemove.startTime.isLessThanOrEqual(interval.startTime) &&
      intervalToRemove.endTime.isGreaterThan(interval.startTime) &&
      intervalToRemove.endTime.isLessThanOrEqual(interval.endTime)
    ) {
      newIntervals[index] = interval.copyWithTimes(
        intervalToRemove.endTime,
        interval.endTime
      );
    }
    // Edit interval if it is overlapped at the end by the interval to remove
    // i.start < r.start < i.end <= r.end
    else if (
      intervalToRemove.startTime.isGreaterThan(interval.startTime) &&
      intervalToRemove.startTime.isLessThanOrEqual(interval.endTime) &&
      intervalToRemove.endTime.isGreaterThan(interval.endTime)
    ) {
      newIntervals[index] = interval.copyWithTimes(
        interval.startTime,
        intervalToRemove.startTime
      );
    }
    // Edit interval if it is encompassed by the interval to remove
    // i.start < r.start < r.end < i.end
    else if (
      intervalToRemove.startTime.isGreaterThan(interval.startTime) &&
      intervalToRemove.endTime.isLessThanOrEqual(interval.endTime)
    ) {
      const firstInterval = interval.copyWithTimes(
        interval.startTime,
        intervalToRemove.startTime
      );
      const secondInterval = interval.copyWithTimes(
        intervalToRemove.endTime,
        interval.endTime
      );

      newIntervals[index] = firstInterval;
      newIntervals.splice(index + 1, 0, secondInterval);
    }
  });

  return reduceSelectionIntervals(newIntervals);
};

/**
 * Adds the selection interval to the selection intervals.
 * @param selectionIntervals The selection intervals
 * @param intervalToAdd The selection interval to add
 * @returns
 */
export const addIntervalToIntervals = (
  selectionIntervals: SelectionInterval[],
  intervalToAdd: SelectionInterval
): SelectionInterval[] => {
  return mergeSelectionIntervals(selectionIntervals, [intervalToAdd]);
};
