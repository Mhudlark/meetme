import { isSameDay } from 'date-fns';

import type { Time24 } from './time24';

export class SelectionInterval {
  public date: Date;

  public startTime: Time24;

  public endTime: Time24;

  public intervalSize: number;

  public count: number;

  constructor(
    date: Date,
    startTime: Time24,
    intervalSize: number,
    count: number
  );
  constructor(
    date: Date,
    startTime: Time24,
    endTime: Time24,
    intervalSize: number
  );
  constructor(
    date: Date,
    startTime: Time24,
    endTime: Time24,
    intervalSize: number,
    count: number
  );
  constructor(...args: Array<any>) {
    this.date = args[0] as Date;
    this.startTime = args[1] as Time24;

    if (args.length === 4 && typeof args[2] === 'number') {
      this.endTime = this.startTime.addTime(args[2] as number);
      this.intervalSize = args[2] as number;
      this.count = args[3] as number;
    } else if (args.length === 4 && typeof args[3] === 'number') {
      this.endTime = args[2] as Time24;
      this.intervalSize = args[3] as number;
      this.count = 1;
    } else {
      this.endTime = args[2] as Time24;
      this.intervalSize = args[3] as number;
      this.count = args[4] as number;
    }
  }

  public isSelected(): boolean {
    return this.count > 0;
  }

  public isEncompassedBy(largerInterval: SelectionInterval): boolean {
    if (!isSameDay(this.date, largerInterval.date))
      throw new Error('Cannot compare selection intervals on different days');

    return (
      this.startTime.isGreaterThanOrEqual(largerInterval.startTime) &&
      this.endTime.isLessThanOrEqual(largerInterval.endTime)
    );
  }

  public isAdjacentTo(laterInterval: SelectionInterval): boolean {
    if (!isSameDay(this.date, laterInterval.date))
      throw new Error(
        'Selection intervals on different days cannot be adjacent'
      );

    return this.endTime.equals(laterInterval.startTime);
  }

  public toString(twelveHour: boolean = false): string {
    return `${this.startTime.toString(twelveHour)} - ${this.endTime.toString(
      twelveHour
    )}`;
  }

  public copyWithCount(count: number): SelectionInterval {
    return new SelectionInterval(
      this.date,
      this.startTime,
      this.endTime,
      this.intervalSize,
      count
    );
  }
}
