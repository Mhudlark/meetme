import type { SchedulorSelectionRange } from '@/sharedTypes';
import { formatDateToFriendlyString } from '@/utils/date';

import type { Time24 } from './time24';
import { getTimeRange } from './time24';

/**
 * Returns the smallest min time from the selection ranges
 * @param selectionRanges The selection ranges
 */
const getMinTimeFromSelectionRanges = (
  selectionRanges: SchedulorSelectionRange[]
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
  selectionRanges: SchedulorSelectionRange[]
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
 * Creates a binary array of intervals (represented as objects)
 * The included obj property is set to true if the interval is included in the selection ranges
 * By default, the included property is set to false
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 */
const createInitialIntervalsBinaryArr = (
  selectionRanges: SchedulorSelectionRange[],
  intervalSize: number
) => {
  const intervalsStartTimes = getTimeRange(
    getMinTimeFromSelectionRanges(selectionRanges),
    getMaxTimeFromSelectionRanges(selectionRanges),
    intervalSize
  );

  const intervalsBinaryArr = intervalsStartTimes.map((intervalStartTime) => ({
    startTime: intervalStartTime,
    included: false,
  }));

  return intervalsBinaryArr;
};

/**
 * Creates a binary array of intervals (represented as objects)
 * The included obj property is set to true if the interval is included in the selection ranges
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 */
const calculateIntervalsBinaryArr = (
  selectionRanges: SchedulorSelectionRange[],
  intervalSize: number
) => {
  const intervalsBinaryArr = createInitialIntervalsBinaryArr(
    selectionRanges,
    intervalSize
  );

  selectionRanges.forEach((selectionRange) => {
    intervalsBinaryArr.forEach((interval, index) => {
      if (
        selectionRange.startTime.isLessThanOrEqual(interval.startTime) &&
        selectionRange.endTime.isGreaterThan(interval.startTime)
      ) {
        const intervalPointer = intervalsBinaryArr?.[index];
        if (intervalPointer) intervalPointer.included = true;
      }
    });
  });

  return intervalsBinaryArr;
};

/**
 * Reduces the selection ranges into the minimum number of ranges.
 * Also, sorts the ranges by start time
 * @param selectionRanges The selection ranges
 * @param intervalSize The interval size in hours
 * @returns A minified, ordered version of the selection ranges
 */
const reduceSelectionRanges = (
  selectionRanges: SchedulorSelectionRange[],
  intervalSize: number
) => {
  const intervalsBinaryArr = calculateIntervalsBinaryArr(
    selectionRanges,
    intervalSize
  );

  const newRanges: SchedulorSelectionRange[] = [];
  let currentRange: SchedulorSelectionRange | null = null;

  intervalsBinaryArr.forEach((interval) => {
    if (interval.included) {
      if (!currentRange) {
        currentRange = {
          startTime: interval.startTime,
          endTime: interval.startTime.addTime(intervalSize),
        };
      } else {
        currentRange.endTime = interval.startTime.addTime(intervalSize);
      }
    } else if (currentRange) {
      newRanges.push(currentRange);
      currentRange = null;
    }
  });

  if (currentRange) newRanges.push(currentRange);

  return newRanges;
};

export class SchedulorSelection {
  public date: Date;

  public selectionRanges: SchedulorSelectionRange[];

  public intervalSize: number;

  constructor(
    date: Date,
    selectionRanges: SchedulorSelectionRange[],
    intervalSize: number
  );
  constructor(
    date: Date,
    startTime: Time24,
    endTime: Time24,
    intervalSize: number
  );
  constructor(...args: Array<any>) {
    this.date = args[0] as Date;
    this.intervalSize = args[args.length - 1] as number;

    if (args.length === 3) {
      const selectionRanges = args[1] as SchedulorSelectionRange[];
      this.selectionRanges = selectionRanges;
    } else if (args.length === 4) {
      const startTime = args[1] as Time24;
      const endTime = args[2] as Time24;
      this.selectionRanges = [{ startTime, endTime }];
    } else {
      throw new Error(
        'Invalid arguments passed to SchedulorSelection constructor'
      );
    }
  }

  public addSelectionRange(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, add the new range and return
    if (this.selectionRanges.length === 0) {
      this.selectionRanges.push({ startTime, endTime });
      return;
    }

    const newSelectionRanges = [
      ...this.selectionRanges,
      { startTime, endTime },
    ];

    this.selectionRanges = reduceSelectionRanges(
      newSelectionRanges,
      this.intervalSize
    );
  }

  public valueOf() {
    return {
      date: this.date,
      selectionRanges: this.selectionRanges,
    };
  }

  public toString(): string {
    return JSON.stringify({
      date: formatDateToFriendlyString(this.date),
      selectionRanges: this.selectionRanges.map((range) => [
        range.startTime.toString(),
        range.endTime.toString(),
      ]),
    });
  }
}
