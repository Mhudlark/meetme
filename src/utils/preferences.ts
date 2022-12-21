import { isSameDay } from 'date-fns';

import type { Preference } from '@/types/preference';
import { PreferenceSelection } from '@/types/preferenceSelection';
import type { Time24 } from '@/types/time24';
import type { User } from '@/types/user';

import { getDateRange } from './date';
import {
  getSelectedIntervalsForTimeRange,
  mergeSelectionIntervals,
} from './typesUtils/selectionInterval';

type Availability = {
  count: number;
  users: User[];
};

export type Interval = {
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

export const calculateOverlappingPreferences = (
  preferences: Preference[],
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
): PreferenceSelection[] => {
  const dateRange = getDateRange(startDate, endDate);

  const allPreferenceSelections = dateRange.map((date) => {
    // Create a blank max intervals array for the given date
    let blankMaxIntervals = getSelectedIntervalsForTimeRange(
      [],
      date,
      intervalSize,
      minTime,
      maxTime
    );
    // Iterate over each preference
    preferences.forEach((preference) => {
      // Get the preference selections for the given date
      preference.selections.forEach((selection) => {
        if (!isSameDay(selection.date, date)) return;

        // Get the max intervals for the given date for time range
        const selectionMaxIntervals = getSelectedIntervalsForTimeRange(
          selection.selectionIntervals,
          selection.date,
          intervalSize,
          minTime,
          maxTime
        );

        // Merge the max intervals for the given date
        blankMaxIntervals = mergeSelectionIntervals(
          blankMaxIntervals,
          selectionMaxIntervals,
          false
        );
      });
    });

    return new PreferenceSelection(
      date,
      blankMaxIntervals,
      intervalSize,
      'overlap'
    );
  });

  return allPreferenceSelections;
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
