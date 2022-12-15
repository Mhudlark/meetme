import type { SchedulorSelectionRange } from '@/sharedTypes';
import { INTERVAL_SIZE } from '@/utils/constants';
import {
  formatDateToFriendlyString,
  setDateTimeWithTime24,
} from '@/utils/date';

import { getTimeRange, Time24 } from './time24';

type IntervalsBinaryArr = { startTime: Time24; included: boolean }[];

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
): IntervalsBinaryArr => {
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
): IntervalsBinaryArr => {
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

const removeRangeFromIntervalsBinaryArr = (
  intervalsBinaryArr: IntervalsBinaryArr,
  rangeToRemove: SchedulorSelectionRange
): IntervalsBinaryArr => {
  const newIntervalsBinaryArr = [...intervalsBinaryArr];

  newIntervalsBinaryArr.forEach((interval, index) => {
    if (
      rangeToRemove.startTime.isLessThanOrEqual(interval.startTime) &&
      rangeToRemove.endTime.isGreaterThan(interval.startTime)
    ) {
      const intervalPointer = newIntervalsBinaryArr?.[index];
      if (intervalPointer) intervalPointer.included = false;
    }
  });

  return newIntervalsBinaryArr;
};

/**
 * Calculates a new selection ranges array from the intervals binary array
 * @param intervalsBinaryArr The intervals binary array
 * @param intervalSize The interval size in hours
 * @returns A new selection ranges array
 */
const getSelectionRangesFromIntervalsBinaryArr = (
  intervalsBinaryArr: IntervalsBinaryArr,
  intervalSize: number
): SchedulorSelectionRange[] => {
  const selectionRanges: SchedulorSelectionRange[] = [];
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
const reduceSelectionRanges = (
  selectionRanges: SchedulorSelectionRange[],
  intervalSize: number
) => {
  const intervalsBinaryArr = calculateIntervalsBinaryArr(
    selectionRanges,
    intervalSize
  );

  return getSelectionRangesFromIntervalsBinaryArr(
    intervalsBinaryArr,
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
const removeSelectionRangeFromSelectionRanges = (
  selectionRanges: SchedulorSelectionRange[],
  selectionRangeToRemove: SchedulorSelectionRange,
  intervalSize: number
): SchedulorSelectionRange[] => {
  const intervalsBinaryArr = calculateIntervalsBinaryArr(
    selectionRanges,
    intervalSize
  );

  const intervalsBinaryArrWithoutRange = removeRangeFromIntervalsBinaryArr(
    intervalsBinaryArr,
    selectionRangeToRemove
  );

  return getSelectionRangesFromIntervalsBinaryArr(
    intervalsBinaryArrWithoutRange,
    intervalSize
  );
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

  public isEmpty(): boolean {
    return this.selectionRanges.length === 0;
  }

  public getSelectionRangesStartTimes(): Time24[] {
    return this.selectionRanges.map((range) => range.startTime);
  }

  public getMinSelectedTime(): Time24 | null {
    if (this.isEmpty()) return null;

    return this.selectionRanges?.[0]?.startTime as Time24;
  }

  public getMinSelectedDateTime(): Date | null {
    const minSelectedTime = this.getMinSelectedTime();

    if (!minSelectedTime) return null;

    return setDateTimeWithTime24(this.date, minSelectedTime as Time24);
  }

  public getMaxSelectedTime(): Time24 | null {
    if (this.isEmpty()) return null;

    return this.selectionRanges?.[this.selectionRanges.length - 1]
      ?.endTime as Time24;
  }

  public getMaxSelectedDateTime(): Date | null {
    const maxSelectedTime = this.getMaxSelectedTime();

    if (!maxSelectedTime) return null;

    return setDateTimeWithTime24(this.date, maxSelectedTime as Time24);
  }

  public addSelectionRange(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, add the new range and return
    if (this.isEmpty()) {
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

  public removeSelectionRange(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, just return
    if (this.isEmpty()) {
      return;
    }

    this.selectionRanges = removeSelectionRangeFromSelectionRanges(
      this.selectionRanges,
      {
        startTime,
        endTime,
      },
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

  public copy(): SchedulorSelection {
    return new SchedulorSelection(
      this.date,
      [...this.selectionRanges],
      this.intervalSize
    );
  }

  public copyWithDate(date: Date): SchedulorSelection {
    const newSelection = new SchedulorSelection(
      this.date,
      [...this.selectionRanges],
      this.intervalSize
    );
    newSelection.date = date;
    return newSelection;
  }

  public copyWithTimes(startTime: Time24, endTime: Time24): SchedulorSelection {
    const newSelection = this.copy();
    newSelection.selectionRanges = [{ startTime, endTime }];
    return newSelection;
  }
}

export const parseSelectionRanges = (
  selectionRanges: string
): SchedulorSelectionRange[] => {
  const parsedSelectionRanges: any[] = JSON.parse(selectionRanges);

  return parsedSelectionRanges.map((selectionRange: any) => ({
    startTime: new Time24(selectionRange[0]),
    endTime: new Time24(selectionRange[1]),
  }));
};

export const parseSelection = (selection: {
  date: string;
  selectionRanges: string;
}): SchedulorSelection => {
  const parsedSelectionRanges = parseSelectionRanges(selection.selectionRanges);

  return new SchedulorSelection(
    new Date(selection.date),
    parsedSelectionRanges,
    INTERVAL_SIZE
  );
};
