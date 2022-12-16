import type {
  SelectableIntervals,
  SelectionIntervalRange,
} from '@/sharedTypes';
import { formatDateToFriendlyString } from '@/utils/date';
import {
  fillSelectableIntervals,
  initSelectableIntervals,
  reduceSelectionRanges,
  removeSelectionRangeFromSelectionRanges,
} from '@/utils/types/schedulorSelection';

import type { Time24 } from './time24';

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
