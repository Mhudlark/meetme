import { addDays, differenceInDays } from 'date-fns';

import type { Preference } from '@/types/preference';
import { Time24 } from '@/types/time24';
import type { User } from '@/types/user';

import { setDateTimeWithTime24 } from './date';

type Availability = {
  count: number;
  ids: string[];
};

type Interval = {
  start: Date;
  availability: Availability;
};

type Day = Interval[];

export type Overlap = Day[];

const createIntervals = (
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24,
  intervalSize: number
) => {
  const numDays = differenceInDays(endDate, startDate);
  const lengthOfDay = maxTime.valueOf() - minTime.valueOf();
  const numIntervalsPerDay = lengthOfDay / intervalSize - 1;

  const totalIntervals: Overlap = [];

  for (let i = 0; i < numDays; i += 1) {
    const dayIntervals: Day = [];
    for (let j = 0; j < numIntervalsPerDay; j += 1) {
      const time = minTime.valueOf() + j * intervalSize;
      const day = addDays(startDate, i);

      const availability: Availability = {
        count: 0,
        ids: [],
      };

      const interval = {
        start: setDateTimeWithTime24(day, new Time24(time)),
        availability,
      };

      dayIntervals.push(interval);
    }
    totalIntervals.push(dayIntervals);
  }

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
      const dayIndex = differenceInDays(selection.startDate, startDate);
      const dayIntervals = allIntervals[dayIndex] as Day;
      const intevalsInDay = dayIntervals.length;

      const startTime = new Time24(selection.startDate);
      const startInterval = Math.floor(
        (startTime.valueOf() - minTime.valueOf()) / intervalSize
      );
      const endTime = new Time24(selection.endDate);
      const endInterval = Math.min(
        Math.floor((endTime.valueOf() - minTime.valueOf()) / intervalSize),
        intevalsInDay - 1
      );

      if (startInterval < 0 || startInterval > intevalsInDay)
        throw new Error('Start interval is out of bounds');

      if (endInterval < 0 || endInterval > intevalsInDay)
        throw new Error('End interval is out of bounds');

      if (startInterval === endInterval) return;

      for (let i = startInterval; i <= endInterval; i += 1) {
        const interval = dayIntervals[i] as Interval;

        const preferenceUser = users.find(
          (user) => user.userId === preference.userId
        ) as User;

        interval.availability.count += 1;
        interval.availability.ids.push(preferenceUser.username);
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
