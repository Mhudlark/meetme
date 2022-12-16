import type { SelectionIntervalRange } from '@/sharedTypes';
import { INTERVAL_SIZE } from '@/utils/constants';
import {
  formatDateToFriendlyString,
  setDateTimeWithTime24,
} from '@/utils/date';

import type { Time24 } from './time24';
import { getTimeRange } from './time24';

type SelectableInterval = { startTime: Time24; selected: boolean };

type SelectableIntervals = SelectableInterval[];

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
const initSelectableIntervals = (
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
const fillSelectableIntervals = (
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
  const newIntervalsBinaryArr = [...selectableIntervals];

  newIntervalsBinaryArr.forEach((interval, index) => {
    if (
      rangeToRemove.startTime.isLessThanOrEqual(interval.startTime) &&
      rangeToRemove.endTime.isGreaterThan(interval.startTime)
    ) {
      const intervalPointer = newIntervalsBinaryArr?.[index];
      if (intervalPointer) intervalPointer.selected = false;
    }
  });

  return newIntervalsBinaryArr;
};

/**
 * Calculates a new selection ranges array from the intervals binary array
 * @param selectableIntervals The intervals binary array
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
const reduceSelectionRanges = (
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
const removeSelectionRangeFromSelectionRanges = (
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

export class SchedulorSelection {
  public date: Date;

  public selectionIntervalRanges: SelectionIntervalRange[];

  public intervalSize: number;

  constructor(
    date: Date,
    selectionRanges: SelectionIntervalRange[],
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
      const selectionRanges = args[1] as SelectionIntervalRange[];
      this.selectionIntervalRanges = selectionRanges;
    } else if (args.length === 4) {
      const startTime = args[1] as Time24;
      const endTime = args[2] as Time24;
      this.selectionIntervalRanges = [{ startTime, endTime }];
    } else {
      throw new Error(
        'Invalid arguments passed to SchedulorSelection constructor'
      );
    }
  }

  public isEmpty(): boolean {
    return this.selectionIntervalRanges.length === 0;
  }

  public getSelectionRangesStartTimes(): Time24[] {
    return this.selectionIntervalRanges.map((range) => range.startTime);
  }

  public getMinSelectedTime(): Time24 | null {
    if (this.isEmpty()) return null;

    return this.selectionIntervalRanges?.[0]?.startTime as Time24;
  }

  public getMinSelectedDateTime(): Date | null {
    const minSelectedTime = this.getMinSelectedTime();

    if (!minSelectedTime) return null;

    return setDateTimeWithTime24(this.date, minSelectedTime as Time24);
  }

  public getMaxSelectedTime(): Time24 | null {
    if (this.isEmpty()) return null;

    return this.selectionIntervalRanges?.[
      this.selectionIntervalRanges.length - 1
    ]?.endTime as Time24;
  }

  public getMaxSelectedDateTime(): Date | null {
    const maxSelectedTime = this.getMaxSelectedTime();

    if (!maxSelectedTime) return null;

    return setDateTimeWithTime24(this.date, maxSelectedTime as Time24);
  }

  public getSelectedIntervals(
    minTime: Time24,
    maxTime: Time24
  ): SelectableIntervals {
    const selectableIntervals = initSelectableIntervals(
      [{ startTime: minTime, endTime: maxTime }],
      this.intervalSize
    );

    return fillSelectableIntervals(
      selectableIntervals,
      this.selectionIntervalRanges
    );
  }

  public addSelectionRange(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, add the new range and return
    if (this.isEmpty()) {
      this.selectionIntervalRanges.push({ startTime, endTime });
      return;
    }

    const newSelectionRanges = [
      ...this.selectionIntervalRanges,
      { startTime, endTime },
    ];

    this.selectionIntervalRanges = reduceSelectionRanges(
      newSelectionRanges,
      this.intervalSize
    );
  }

  public removeSelectionRange(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, just return
    if (this.isEmpty()) {
      return;
    }

    this.selectionIntervalRanges = removeSelectionRangeFromSelectionRanges(
      this.selectionIntervalRanges,
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
      selectionRanges: this.selectionIntervalRanges,
    };
  }

  public toString(): string {
    return JSON.stringify({
      date: formatDateToFriendlyString(this.date),
      selectionRanges: this.selectionIntervalRanges.map((range) => [
        range.startTime.toString(),
        range.endTime.toString(),
      ]),
    });
  }

  public copy(): SchedulorSelection {
    return new SchedulorSelection(
      this.date,
      [...this.selectionIntervalRanges],
      this.intervalSize
    );
  }

  public copyWithDate(date: Date): SchedulorSelection {
    const newSelection = new SchedulorSelection(
      this.date,
      [...this.selectionIntervalRanges],
      this.intervalSize
    );
    newSelection.date = date;
    return newSelection;
  }

  public copyWithTimes(startTime: Time24, endTime: Time24): SchedulorSelection {
    const newSelection = this.copy();
    newSelection.selectionIntervalRanges = [{ startTime, endTime }];
    return newSelection;
  }

  public copyAsEmpty(): SchedulorSelection {
    return new SchedulorSelection(this.date, [], this.intervalSize);
  }
}

export const parseSelectionRanges = (
  selectionRanges: any[]
): SelectionIntervalRange[] => {
  return selectionRanges.map(
    (selectionRange: { startTime: Time24; endTime: Time24 }) => selectionRange
  );
};

export const parseSchedulorSelection = (selection: {
  date: string;
  selectionRanges: any[];
}): SchedulorSelection => {
  const parsedSelectionRanges = parseSelectionRanges(selection.selectionRanges);

  return new SchedulorSelection(
    new Date(selection.date),
    parsedSelectionRanges,
    INTERVAL_SIZE
  );
};
