import { getHours, getMinutes, isDate } from 'date-fns';

const isNumberValidTime24 = (num: number): boolean => {
  if (num < 0 || num > 24) throw new Error(`Invalid time value: ${num}`);
  if (num % 0.5 !== 0) throw new Error(`Invalid time value: ${num}`);
  return true;
};

const parseStringToTime24Number = (timeStr: string): number => {
  const [hoursStr, minutesStr] = timeStr.split(':');

  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  return hours + minutes / 60;
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
  constructor(...args: Array<any>) {
    if (typeof args[0] === 'number') {
      const num = args[0] as number;
      isNumberValidTime24(num);
      this.value = num;
    } else if (isDate(args[0])) {
      const date = args[0] as Date;
      const hours = getHours(date);
      const minutes = getMinutes(date) / 60;
      this.value = hours + minutes;
    } else if (typeof args[0] === 'string') {
      const str = args[0] as string;
      const num = parseStringToTime24Number(str);
      isNumberValidTime24(num);
      this.value = num;
    }
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

  public toString(twelveHour: boolean = false): string {
    const hours = this.getHours(twelveHour);
    const minutes = this.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
