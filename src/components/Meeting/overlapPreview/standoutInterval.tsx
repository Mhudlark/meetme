import { Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import { DbContext } from '@/context/dbContext';
import type { SelectionInterval } from '@/types/selectionInterval';
import { formatDateToFriendlyString } from '@/utils/date';
import { getUsersFromUserIds } from '@/utils/typesUtils/user';

export interface StandoutIntervalProps {
  standoutInterval: SelectionInterval;
}

export default function StandoutInterval({
  standoutInterval,
}: StandoutIntervalProps) {
  const { meeting } = useContext(DbContext);

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Stack sx={{ gap: 2, flexDirection: 'row', flexWrap: 'wrap' }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {formatDateToFriendlyString(standoutInterval.date)}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {standoutInterval.startTime.toString()}
          {' - '}
          {standoutInterval.endTime.toString()}
        </Typography>
      </Stack>
      <Typography variant="body2">
        {getUsersFromUserIds(standoutInterval.userIds, meeting?.users ?? [])
          .map((user) => user.username)
          .join(', ')}
      </Typography>
    </Stack>
  );
}
