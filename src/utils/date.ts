import {
  addDays,
  differenceInCalendarDays,
  format,
  setHours,
  setMinutes,
} from 'date-fns';
import { range } from 'lodash';

import type { Time24 } from '@/types/time24';

/**
 * Calculates the number of days between two dates, including the start and end dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of days between the two dates, inclusive
 */
export const calculateNumDaysBetweenDates = (
  startDate: Date,
  endDate: Date,
  includeEndDate: boolean = false
) => {
  const diff = differenceInCalendarDays(endDate, startDate);
  return includeEndDate ? diff + 1 : diff;
};

export const getDateRange = (
  start: Date,
  end: Date,
  includeEndDate: boolean = false
): Date[] => {
  const numDays = calculateNumDaysBetweenDates(start, end, includeEndDate);

  const dates = range(0, numDays).map((d) => addDays(start, d));

  return dates;
};

export const formatDateToFriendlyString = (date: Date): string => {
  return format(date, 'EEEE do MMM, yyyy');
};

/**
 * Sets the time of a date
 * @param date A date
 * @param time A time of the day
 * @returns A modified date
 */
export const setDateTimeWithTime24 = (date: Date, time: Time24): Date => {
  const newDate = setHours(date, time.getHours());
  return setMinutes(newDate, time.getMinutes());
};
