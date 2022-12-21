import { isSameDay } from 'date-fns';

import type { Preference } from '@/types/preference';
import { PreferenceSelection } from '@/types/preferenceSelection';
import type { Time24 } from '@/types/time24';

import { getDateRange } from './date';
import {
  getSelectedIntervalsForTimeRange,
  mergeSelectionIntervals,
} from './typesUtils/selectionInterval';

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
