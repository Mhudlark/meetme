import type { SelectionIntervalRange } from '@/sharedTypes';
import { SchedulorSelection } from '@/types/schedulorSelection';
import { Time24 } from '@/types/time24';

import { INTERVAL_SIZE } from '../constants';

export const parseSelectionRanges = (
  selectionRanges: any[]
): SelectionIntervalRange[] => {
  return selectionRanges.map(
    (selectionRange: {
      startTime: { value: number };
      endTime: { value: number };
    }) => ({
      startTime: new Time24(selectionRange.startTime.value),
      endTime: new Time24(selectionRange.endTime.value),
    })
  );
};

export const parseSchedulorSelection = (selection: {
  date: string;
  selectionRanges: any[];
}): SchedulorSelection => {
  const parsedSelectionRanges = parseSelectionRanges(selection.selectionRanges);

  return new SchedulorSelection(
    new Date(selection.date),
    parsedSelectionRanges,
    INTERVAL_SIZE
  );
};
