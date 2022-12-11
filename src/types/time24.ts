import { getHours, getMinutes, isDate } from 'date-fns';

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
    if (args.length === 1 && typeof args[0] === 'number') {
      const num = args[0] as number;
      isNumberValidTime24(num);
      this.value = num;
    } else if (args.length === 1 && isDate(args[0])) {
      const date = args[0] as Date;
      this.value = parseDateToTime24Number(date);
    } else if (args.length === 1 && typeof args[0] === 'string') {
      const str = args[0] as string;
      this.value = parseStringToTime24Number(str);
    } else if (
      args.length === 2 &&
      typeof args[0] === 'number' &&
      typeof args[1] === 'number'
    ) {
      const hours = args[0] as number;
      const minutes = args[1] as number;
      this.value = parseHoursMinsToTime24Number(hours, minutes);
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
