import { Stack, Typography } from '@mui/material';

import type { SelectionInterval } from '@/types/selectionInterval';
import { formatDateToFriendlyString } from '@/utils/date';

export interface StandoutIntervalProps {
  standoutInterval: SelectionInterval;
}

export default function StandoutInterval({
  standoutInterval,
}: StandoutIntervalProps) {
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {formatDateToFriendlyString(standoutInterval.date)}
      </Typography>
      <Typography variant="body2">
        {standoutInterval.startTime.toString()}
        {' - '}
        {standoutInterval.endTime.toString()}
      </Typography>
    </Stack>
  );
}
