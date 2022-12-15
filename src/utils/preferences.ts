import { differenceInCalendarDays } from 'date-fns';
import { range } from 'lodash';

import type { Preference } from '@/types/preference';
import { Time24 } from '@/types/time24';
import type { User } from '@/types/user';
import { getUserFromId } from '@/types/user';

import { getDateRange, setDateTimeWithTime24 } from './date';

type Availability = {
  count: number;
  users: User[];
};

type Interval = {
  start: Date;
  availability: Availability;
};

type Day = Interval[];

export type Overlap = Day[];

/**
 * Calculates the number of intervals between the given times
 * (will return a decimal if the interval size is not a factor of the time difference)
 * @param minTime The minimum time of the day
 * @param maxTime The maximum time of the day
 * @param intervalSize The size of each interval in hours
 */
export const calculateNumIntervalsBetweenTimes = (
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
): number => {
  return (maxTime.valueOf() - minTime.valueOf()) / intervalSize;
};

/**
 * Calculates the index of the interval that the given time falls in
 * @param time The time to calculate the interval index for
 * @param minTime The minimum time of the day
 * @param intervalSize The size of each interval in hours
 * @param numIntervalsInDay The number of intervals in a day
 * @returns
 */
export const calculateIntervalIndexFromTime = (
  time: Time24,
  minTime: Time24,
  intervalSize: number,
  numIntervalsInDay: number
): number => {
  const intervalIndex = Math.floor(
    (time.valueOf() - minTime.valueOf()) / intervalSize
  );

  if (intervalIndex < 0)
    throw new Error(
      `Interval index, ${intervalIndex}, is less than 0.
      Min time: ${minTime}, time: ${time}.`
    );
  if (intervalIndex > numIntervalsInDay)
    throw new Error(
      `Interval index, ${intervalIndex}, is greater than or equal to the number of intervals in a day, ${numIntervalsInDay}.
      Min time: ${minTime}, time: ${time}.`
    );

  return intervalIndex;
};

const createIntervals = (
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
): Overlap => {
  const numIntervalsPerDay = calculateNumIntervalsBetweenTimes(
    minTime,
    maxTime,
    intervalSize
  );

  // Generate intervals for entire range
  const totalIntervals: Overlap = getDateRange(startDate, endDate, true).map(
    (day) => {
      // Generate intervals for each day
      const dayIntervals: Day = range(numIntervalsPerDay).map(
        (intervalIndex) => {
          const time = minTime.valueOf() + intervalIndex * intervalSize;

          const availability: Availability = {
            count: 0,
            users: [],
          };

          const interval: Interval = {
            start: setDateTimeWithTime24(day, new Time24(time)),
            availability,
          };

          return interval;
        }
      );

      return dayIntervals;
    }
  );

  return totalIntervals;
};

export const calculateOverlappingPreferences = (
  preferences: Preference[],
  users: User[],
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
) => {
  const allIntervals = createIntervals(
    startDate,
    endDate,
    minTime,
    maxTime,
    intervalSize
  );

  preferences.forEach((preference) => {
    preference.scheduleSelections.forEach((selection) => {
      const dayIndex = differenceInCalendarDays(selection.date, startDate);
      const dayIntervals = allIntervals[dayIndex] as Day;
      const numIntervalsInDay = dayIntervals.length;

      const startTime = selection.getMinSelectedTime() as Time24;
      const startIntervalIndex = calculateIntervalIndexFromTime(
        startTime,
        minTime,
        intervalSize,
        numIntervalsInDay
      );

      const endTime = selection.getMaxSelectedTime() as Time24;
      const endIntervalIndex = calculateIntervalIndexFromTime(
        endTime,
        minTime,
        intervalSize,
        numIntervalsInDay
      );

      // If the start and end interval indices are the same,
      // then the selection is less than an interval
      if (startIntervalIndex === endIntervalIndex) return;

      for (
        let intervalIndex = startIntervalIndex;
        intervalIndex < endIntervalIndex;
        intervalIndex += 1
      ) {
        const interval = dayIntervals[intervalIndex] as Interval;

        const preferenceUser = getUserFromId(users, preference.userId);

        interval.availability.count += 1;
        interval.availability.users.push(preferenceUser);
      }
    });
  });

  return allIntervals;
};

const overlapColours = [
  '#ffffff',
  '#e8f2e5',
  '#d1e5cc',
  '#bad8b3',
  '#a3cc9a',
  '#8cbf82',
  '#74b26a',
  '#5ca552',
  '#40983a',
  '#1a8b1f',
];

export const getOverlapColour = (count: number) => {
  if (count >= overlapColours.length)
    return overlapColours[overlapColours.length - 1];
  return overlapColours[count];
};
