import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';

// Helper function that uses date-fns methods to determine if a date is between two other dates
export const dateHourIsBetween = (
  start: Date,
  candidate: Date,
  end: Date
): boolean =>
  (candidate.getTime() === start.getTime() || isAfter(candidate, start)) &&
  (candidate.getTime() === end.getTime() || isAfter(end, candidate));

export const dateIsBetween = (
  start: Date,
  candidate: Date,
  end: Date
): boolean => {
  const startOfCandidate = startOfDay(candidate);
  const startOfStart = startOfDay(start);
  const startOfEnd = startOfDay(end);

  return (
    (startOfCandidate.getTime() === startOfStart.getTime() ||
      isAfter(startOfCandidate, startOfStart)) &&
    (startOfCandidate.getTime() === startOfEnd.getTime() ||
      isAfter(startOfEnd, startOfCandidate))
  );
};

export const timeIsBetween = (
  start: Date,
  candidate: Date,
  end: Date
): boolean => {
  const candidateTime = candidate.getHours() * 60 + candidate.getMinutes();
  const startTime = start.getHours() * 60 + start.getMinutes();
  const endTime = end.getHours() * 60 + end.getMinutes();

  return candidateTime >= startTime && candidateTime <= endTime;
};

export const getDateRange = (
  start: Date,
  end: Date,
  includeEndDate: boolean = false
): Date[] => {
  const numDaysBetween = differenceInDays(end, start);
  const numDays = includeEndDate ? numDaysBetween : numDaysBetween - 1;

  const dates = [];
  for (let d = 0; d <= numDays; d += 1) {
    dates.push(addDays(start, d));
  }
  return dates;
};

export const formatDateToFriendlyString = (date: Date): string => {
  return format(date, 'EEEE do MMM, yyyy');
};

/**
 * Sets the time of a date
 * @param date A date
 * @param time A number between 0 and 24 (inclusive)
 * @returns A modified date
 */
export const setDateTimeWithBase24Number = (date: Date, time: number): Date => {
  const newDate = setHours(date, time - (time % 1));
  return setMinutes(newDate, time % 1 === 0.5 ? 30 : 0);
};
