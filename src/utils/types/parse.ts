import type { SelectionIntervalRange } from '@/sharedTypes';
import { SchedulorSelection } from '@/types/schedulorSelection';
import { Time24 } from '@/types/time24';

import { INTERVAL_SIZE } from '../constants';

type UnparsedSelectionIntervalRange = {
  startTime: { value: number };
  endTime: { value: number };
};

export const parseSelectionRanges = (
  selectionRanges: UnparsedSelectionIntervalRange[]
): SelectionIntervalRange[] => {
  return selectionRanges.map(
    (selectionRange: UnparsedSelectionIntervalRange) => ({
      startTime: new Time24(selectionRange.startTime.value),
      endTime: new Time24(selectionRange.endTime.value),
    })
  );
};

export const parseSchedulorSelection = (selection: {
  date: string;
  selectionIntervalRanges: UnparsedSelectionIntervalRange[];
}): SchedulorSelection => {
  const parsedSelectionRanges = parseSelectionRanges(
    selection.selectionIntervalRanges
  );

  return new SchedulorSelection(
    new Date(selection.date),
    parsedSelectionRanges,
    INTERVAL_SIZE
  );
};

export const parseSelectionsString = (
  selections: string
): SchedulorSelection[] => {
  return JSON.parse(selections).map(parseSchedulorSelection);
};
