import { isSameDay } from 'date-fns';

import { setDateTimeWithTime24 } from '@/utils/date';

import type { Time24 } from './time24';

export class SelectionInterval {
  public date: Date;

  public startTime: Time24;

  public endTime: Time24;

  public intervalSize: number;

  public userIds: string[];

  constructor(
    date: Date,
    startTime: Time24,
    intervalSize: number,
    userIds: string[]
  );
  constructor(
    date: Date,
    startTime: Time24,
    endTime: Time24,
    intervalSize: number,
    userIds: string[]
  );
  constructor(...args: Array<any>) {
    this.date = args[0] as Date;
    this.startTime = args[1] as Time24;

    // date, startTime, intervalSize, userIds
    if (args.length === 4 && typeof args[2] === 'number') {
      this.endTime = this.startTime.addTime(args[2] as number);
      this.intervalSize = args[2] as number;
      this.userIds = args[3] as string[];
    }
    // date, startTime, endTime, intervalSize, userIds
    else if (args.length === 5) {
      this.endTime = args[2] as Time24;
      this.intervalSize = args[3] as number;
      this.userIds = args[4] as string[];
    }
    // Invalid arguments
    else {
      throw new Error(
        `Invalid arguments passed to PreferenceSelection constructor: ${args}`
      );
    }
  }

  public isSelected(): boolean {
    return this.userIds.length > 0;
  }

  public count(): number {
    return this.userIds.length;
  }

  public getStartDate(): Date {
    return setDateTimeWithTime24(this.date, this.startTime);
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

  public hasSameUserIds(otherInterval: SelectionInterval): boolean {
    return (
      this.userIds.length === otherInterval.userIds.length &&
      this.userIds.every((userId) => otherInterval.userIds.includes(userId)) &&
      otherInterval.userIds.every((userId) => this.userIds.includes(userId))
    );
  }

  public toString(twelveHour: boolean = false): string {
    return `${this.startTime.toString(twelveHour)} - ${this.endTime.toString(
      twelveHour
    )}`;
  }

  public copy(): SelectionInterval {
    return new SelectionInterval(
      this.date,
      this.startTime,
      this.endTime,
      this.intervalSize,
      [...this.userIds]
    );
  }

  public copyWithUserIds(userIds: string[]): SelectionInterval {
    return new SelectionInterval(
      this.date,
      this.startTime,
      this.endTime,
      this.intervalSize,
      userIds
    );
  }

  public copyWithDate(date: Date): SelectionInterval {
    return new SelectionInterval(
      date,
      this.startTime,
      this.endTime,
      this.intervalSize,
      [...this.userIds]
    );
  }
}
