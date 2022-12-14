import { getHours, getMinutes, isDate } from 'date-fns';
import { isNumber, range } from 'lodash';

const isNumberValidTime24 = (num: number): boolean => {
  if (num < 0 || num > 24)
    throw new Error(`Invalid time value (hours not valid): ${num}`);
  if (num % 0.5 !== 0 && num !== 0)
    throw new Error(`Invalid time value (30 mins is not a factor): ${num}`);
  return true;
};

const parseHoursMinsToTime24Number = (
  hours: number,
  minutes: number
): number => {
  const num = hours + minutes / 60;
  isNumberValidTime24(num);
  return num;
};

const parseDateToTime24Number = (time: Date): number => {
  const hours = getHours(time);
  const minutes = getMinutes(time);

  return parseHoursMinsToTime24Number(hours, minutes);
};

const parseStringToTime24Number = (timeStr: string): number => {
  const [hoursStr, minutesStr] = timeStr.split(':');

  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  return parseHoursMinsToTime24Number(hours, minutes);
};

/**
 * A number between 0 and 24 (inclusive)
 * Represent 24 hr time
 */
export class Time24 {
  private value: number = 0;

  constructor(time24: number);
  constructor(time: Date);
  constructor(time24: string);
  constructor(hours: number, minutes: number);
  constructor(...args: Array<any>) {
    // time24
    if (args.length === 1 && typeof args[0] === 'number') {
      const num = args[0]!;
      isNumberValidTime24(num);
      this.value = num;
    }
    // time
    else if (args.length === 1 && isDate(args[0])) {
      const date = args[0]!;
      this.value = parseDateToTime24Number(date);
    }
    // time24
    else if (args.length === 1 && typeof args[0] === 'string') {
      const str = args[0]!;
      this.value = parseStringToTime24Number(str);
    }
    // hours, minutes
    else if (args.length === 2 && isNumber(args[0]) && isNumber(args[1])) {
      const hours = args[0]!;
      const minutes = args[1]!;
      this.value = parseHoursMinsToTime24Number(hours, minutes);
    }
  }

  public static fromNumber(time: number): Time24 {
    return new Time24(time);
  }

  public static fromDate(time: Date): Time24 {
    return new Time24(time);
  }

  public equals(time: Time24): boolean {
    return this.value === time.value;
  }

  public valueOf(): number {
    return this.value;
  }

  public getHours(twelveHour: boolean = false): number {
    const time = this.valueOf();
    const hours = time - (time % 1);
    return twelveHour ? hours % 12 : hours;
  }

  public getMinutes(): number {
    const time = this.valueOf();
    return time % 1 === 0.5 ? 30 : 0;
  }

  public isLessThan(otherTime: Time24): boolean {
    return this.valueOf() < otherTime.valueOf();
  }

  public isLessThanOrEqual(otherTime: Time24): boolean {
    return this.valueOf() <= otherTime.valueOf();
  }

  public isGreaterThan(otherTime: Time24): boolean {
    return this.valueOf() > otherTime.valueOf();
  }

  public isGreaterThanOrEqual(otherTime: Time24): boolean {
    return this.valueOf() >= otherTime.valueOf();
  }

  public getMinTime(otherTime: Time24): Time24 {
    return this.isLessThan(otherTime) ? this : otherTime;
  }

  public getMaxTime(otherTime: Time24): Time24 {
    return this.isGreaterThan(otherTime) ? this : otherTime;
  }

  public addTime24(time: Time24): Time24 {
    return new Time24(this.valueOf() + time.valueOf());
  }

  public addTime(time: number): Time24 {
    return new Time24(this.valueOf() + time);
  }

  public toUnpaddedString(twelveHour: boolean = false): string {
    const hours = this.getHours(twelveHour);
    const minutes = this.getMinutes();
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;
  }

  public toString(twelveHour: boolean = false): string {
    const hours = this.getHours(twelveHour);
    const minutes = this.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}

export const getTimeRange = (
  startTime: Time24,
  endTime: Time24,
  step: number,
  includeEndTime: boolean = false
): Time24[] => {
  const startTimeNum = startTime.valueOf();
  const endTimeNum = endTime.valueOf() + (includeEndTime ? step : 0);

  return range(startTimeNum, endTimeNum, step).map((t) => new Time24(t));
};
