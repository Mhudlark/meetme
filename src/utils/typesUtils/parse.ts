import { PreferenceSelection } from '@/types/preferenceSelection';
import { SelectionInterval } from '@/types/selectionInterval';
import { Time24 } from '@/types/time24';

import { INTERVAL_SIZE } from '../constants';

type UnparsedTime24 = { value: number };

const parseTime24 = (time24: UnparsedTime24): Time24 => {
  return new Time24(time24.value);
};

type UnparsedSelectionInterval = {
  date: string;
  startTime: UnparsedTime24;
  endTime: UnparsedTime24;
  intervalSize: number;
};

export const parseSelectionIntervals = (
  unparsedSelectionIntervals: UnparsedSelectionInterval[]
): SelectionInterval[] => {
  return unparsedSelectionIntervals.map(
    (unparsedSelectionInterval: UnparsedSelectionInterval) =>
      new SelectionInterval(
        new Date(unparsedSelectionInterval.date),
        parseTime24(unparsedSelectionInterval.startTime),
        parseTime24(unparsedSelectionInterval.endTime),
        unparsedSelectionInterval.intervalSize
      )
  );
};

export const parsePreferenceSelection = (selection: {
  date: string;
  selectionIntervalRanges: UnparsedSelectionInterval[];
}): PreferenceSelection => {
  const date = new Date(selection.date);

  const parsedSelectionRanges = parseSelectionIntervals(
    selection.selectionIntervalRanges
  );

  return new PreferenceSelection(date, parsedSelectionRanges, INTERVAL_SIZE);
};

export const parseSelectionsString = (
  selections: string
): PreferenceSelection[] => {
  return JSON.parse(selections).map(parsePreferenceSelection);
};
