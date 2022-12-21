import { formatDateToFriendlyString } from '@/utils/date';
import {
  addIntervalToIntervals,
  getSelectedIntervalsForTimeRange,
  removeIntervalFromIntervals,
} from '@/utils/typesUtils/selectionInterval';

import { SelectionInterval } from './selectionInterval';
import type { Time24 } from './time24';

export class PreferenceSelection {
  public date: Date;

  public selectionIntervals: SelectionInterval[];

  public intervalSize: number;

  public userId: string;

  constructor(
    date: Date,
    selectionIntervals: SelectionInterval[],
    intervalSize: number,
    userId: string
  );
  constructor(
    date: Date,
    startTime: Time24,
    endTime: Time24,
    intervalSize: number,
    userId: string
  );
  constructor(...args: Array<any>) {
    this.date = args[0] as Date;
    this.intervalSize = args[args.length - 2] as number;
    this.userId = args[args.length - 1] as string;

    // date, selectionIntervals, intervalSize, userId
    if (args.length === 4) {
      this.selectionIntervals = args[1] as SelectionInterval[];
    }
    // date, startTime, endTime, intervalSize, userId
    else if (args.length === 5) {
      const startTime = args[1] as Time24;
      const endTime = args[2] as Time24;
      this.selectionIntervals = [
        new SelectionInterval(
          this.date,
          startTime,
          endTime,
          this.intervalSize,
          [this.userId]
        ),
      ];
    }
    // Invalid arguments
    else {
      throw new Error(
        `Invalid arguments passed to PreferenceSelection constructor: ${args}`
      );
    }
  }

  public isEmpty(): boolean {
    return this.selectionIntervals.length === 0;
  }

  /**
   * Returns the selection intervals for the given time range, including the
   * unselected intervals.
   * @param minTime The minimum time to get selection intervals for
   * @param maxTime The maximum time to get selection intervals for
   */
  public getSelectedIntervals(
    minTime: Time24,
    maxTime: Time24
  ): SelectionInterval[] {
    return getSelectedIntervalsForTimeRange(
      this.selectionIntervals,
      this.date,
      this.intervalSize,
      minTime,
      maxTime
    );
  }

  private initSelectionInterval(
    startTime: Time24,
    endTime: Time24,
    userId?: string
  ): SelectionInterval {
    return new SelectionInterval(
      this.date,
      startTime,
      endTime,
      this.intervalSize,
      [userId || this.userId]
    );
  }

  public addSelectionInterval(newInterval: SelectionInterval): void {
    // If no selection intervals exist, add the new interval and return
    if (this.isEmpty()) {
      this.selectionIntervals.push(newInterval);
      return;
    }

    this.selectionIntervals = addIntervalToIntervals(
      this.selectionIntervals,
      newInterval
    );
  }

  public addSelectionIntervalFromTimes(
    startTime: Time24,
    endTime: Time24,
    userId?: string
  ): void {
    const newInterval = this.initSelectionInterval(startTime, endTime, userId);

    this.addSelectionInterval(newInterval);
  }

  public removeSelectionInterval(startTime: Time24, endTime: Time24): void {
    // If no selection intervals exist, just return
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
      selectionIntervals: this.selectionIntervals,
    };
  }

  public toString(): string {
    return JSON.stringify({
      date: formatDateToFriendlyString(this.date),
      selectionIntervals: this.selectionIntervals.map((interval) => [
        interval.startTime.toString(),
        interval.endTime.toString(),
      ]),
    });
  }

  public copy(): PreferenceSelection {
    return new PreferenceSelection(
      this.date,
      [...this.selectionIntervals],
      this.intervalSize,
      this.userId
    );
  }

  public copyWithDate(date: Date): PreferenceSelection {
    const newSelection = new PreferenceSelection(
      date,
      this.selectionIntervals.map((interval) => interval.copyWithDate(date)),
      this.intervalSize,
      this.userId
    );
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
      this.intervalSize,
      this.userId
    );
    return newSelection;
  }

  public copyAsEmpty(): PreferenceSelection {
    return new PreferenceSelection(
      this.date,
      [],
      this.intervalSize,
      this.userId
    );
  }

  public copyWithSelectionIntervals(
    selectionIntervals: SelectionInterval[]
  ): PreferenceSelection {
    return new PreferenceSelection(
      this.date,
      selectionIntervals,
      this.intervalSize,
      this.userId
    );
  }
}
