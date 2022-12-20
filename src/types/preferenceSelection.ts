import { formatDateToFriendlyString } from '@/utils/date';
import { add } from '@/utils/math';
import {
  addIntervalToIntervals,
  getSelectionIntervalRange,
  mergeSelectionIntervals,
  removeIntervalFromIntervals,
} from '@/utils/typesUtils/selectionInterval';

import { SelectionInterval } from './selectionInterval';
import type { Time24 } from './time24';

export class PreferenceSelection {
  public date: Date;

  public selectionIntervals: SelectionInterval[];

  public intervalSize: number;

  constructor(
    date: Date,
    selectionRanges: SelectionInterval[],
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
      this.selectionIntervals = args[1] as SelectionInterval[];
    } else if (args.length === 4) {
      const startTime = args[1] as Time24;
      const endTime = args[2] as Time24;
      this.selectionIntervals = [
        new SelectionInterval(this.date, startTime, endTime, this.intervalSize),
      ];
    } else {
      throw new Error(
        `Invalid arguments passed to PreferenceSelection constructor: ${args}`
      );
    }
  }

  public isEmpty(): boolean {
    return this.selectionIntervals.length === 0;
  }

  public getSelectionIntervalsStartTimes(): Time24[] {
    return this.selectionIntervals.map((interval) => interval.startTime);
  }

  /**
   * Returns the selection intervals for the given time range. If those intervals
   * are not selection in this preference selection, then those selection intervals
   * will have a count of 0 and will return false for isSelected().
   * @param minTime The minimum time to get selection intervals for
   * @param maxTime The maximum time to get selection intervals for
   */
  public getSelectedIntervals(
    minTime: Time24,
    maxTime: Time24
  ): SelectionInterval[] {
    const blankSelectionIntervals = getSelectionIntervalRange(
      this.date,
      minTime,
      maxTime,
      this.intervalSize
    );

    return mergeSelectionIntervals(
      blankSelectionIntervals,
      this.selectionIntervals,
      add
    );
  }

  private initSelectionInterval(
    startTime: Time24,
    endTime: Time24
  ): SelectionInterval {
    return new SelectionInterval(
      this.date,
      startTime,
      endTime,
      this.intervalSize
    );
  }

  public addSelectionInterval(
    startTime: Time24,
    endTime: Time24,
    mergeIntervalsWithDifferentCounts: boolean = true
  ): void {
    const newInterval = this.initSelectionInterval(startTime, endTime);

    // If no selection ranges exist, add the new range and return
    if (this.isEmpty()) {
      this.selectionIntervals.push(newInterval);
      return;
    }

    this.selectionIntervals = addIntervalToIntervals(
      this.selectionIntervals,
      newInterval,
      mergeIntervalsWithDifferentCounts
    );
  }

  public removeSelectionInterval(startTime: Time24, endTime: Time24): void {
    // If no selection ranges exist, just return
    if (this.isEmpty()) {
      return;
    }

    const intervalToRemove = this.initSelectionInterval(startTime, endTime);

    this.selectionIntervals = removeIntervalFromIntervals(
      this.selectionIntervals,
      intervalToRemove
    );
  }

  public valueOf() {
    return {
      date: this.date,
      selectionRanges: this.selectionIntervals,
    };
  }

  public toString(): string {
    return JSON.stringify({
      date: formatDateToFriendlyString(this.date),
      selectionRanges: this.selectionIntervals.map((range) => [
        range.startTime.toString(),
        range.endTime.toString(),
      ]),
    });
  }

  public copy(): PreferenceSelection {
    return new PreferenceSelection(
      this.date,
      [...this.selectionIntervals],
      this.intervalSize
    );
  }

  public copyWithDate(date: Date): PreferenceSelection {
    const newSelection = new PreferenceSelection(
      this.date,
      [...this.selectionIntervals],
      this.intervalSize
    );
    newSelection.date = date;
    return newSelection;
  }

  public copyWithTimes(
    startTime: Time24,
    endTime: Time24
  ): PreferenceSelection {
    const newSelection = new PreferenceSelection(
      this.date,
      startTime,
      endTime,
      this.intervalSize
    );
    return newSelection;
  }

  public copyAsEmpty(): PreferenceSelection {
    return new PreferenceSelection(this.date, [], this.intervalSize);
  }
}
