import { useContext } from 'react';

import { DbContext } from '@/context/dbContext';
import type { SelectionInterval } from '@/types/selectionInterval';
import type { User } from '@/types/user';
import { getOverlapColour } from '@/utils/preferences';
import { getUsersFromUserIds } from '@/utils/typesUtils/user';

import CustomTooltip from '../../Tooltip';

export type FilteredUser = User & {
  included: boolean;
};

export interface OverlapPreviewCellProps {
  interval: SelectionInterval;
}

export default function OverlapPreviewCell({
  interval,
}: OverlapPreviewCellProps) {
  const { meeting } = useContext(DbContext);

  return (
    <CustomTooltip
      title={getUsersFromUserIds(interval.userIds, meeting?.users ?? [])
        .map((user) => user.username)
        .join(', ')}
      placement="top"
    >
      <div
        className={`
            flex
            select-none
            justify-center
            rounded-md
            border-2 border-gray-900
            py-1
            px-2
        `}
        style={{
          backgroundColor: getOverlapColour(
            interval.count(),
            meeting?.users.length ?? 0
          ),
        }}
      >
        {interval.startTime.toString()}
      </div>
    </CustomTooltip>
  );
}
