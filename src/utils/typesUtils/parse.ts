import { PreferenceSelection } from '@/types/preferenceSelection';
import { SelectionInterval } from '@/types/selectionInterval';
import { Time24 } from '@/types/time24';

type UnparsedTime24 = { value: number };

const parseTime24 = (time24: UnparsedTime24): Time24 => {
  return new Time24(time24.value);
};

type UnparsedSelectionInterval = {
  date: string;
  startTime: UnparsedTime24;
  endTime: UnparsedTime24;
  intervalSize: number;
  userIds: string[];
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
        unparsedSelectionInterval.intervalSize,
        unparsedSelectionInterval.userIds
      )
  );
};

type UnparsedPreferenceSelection = {
  date: string;
  selectionIntervals: UnparsedSelectionInterval[];
  intervalSize: number;
  userId: string;
};

export const parsePreferenceSelection = (
  unparsedSelection: UnparsedPreferenceSelection
): PreferenceSelection => {
  const date = new Date(unparsedSelection.date);

  const parsedSelectionIntervals = parseSelectionIntervals(
    unparsedSelection.selectionIntervals
  );

  return new PreferenceSelection(
    date,
    parsedSelectionIntervals,
    unparsedSelection.intervalSize,
    unparsedSelection.userId
  );
};

export const parsePreferenceSelectionsString = (
  selections: string
): PreferenceSelection[] => {
  return JSON.parse(selections).map(parsePreferenceSelection);
};
