import { Stack, Typography } from '@mui/material';

import type { PreferenceSelection } from '@/types/preferenceSelection';
import { formatDateToFriendlyString } from '@/utils/date';

import OverlapPreviewCell from './overlapPreviewCell';

export interface FilteredOverlapPreviewProps {
  filteredOverlappingPreferences: PreferenceSelection[];
}

export default function FilteredOverlapPreview({
  filteredOverlappingPreferences,
}: FilteredOverlapPreviewProps) {
  return (
    <Stack
      sx={{
        borderRadius: 2,
        gap: 3,
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {filteredOverlappingPreferences.map((preferenceSelection) => (
        <Stack key={preferenceSelection.date.toString()} sx={{ gap: 1 }}>
          {preferenceSelection?.date && (
            <Typography variant="body1">
              {formatDateToFriendlyString(preferenceSelection.date)}
            </Typography>
          )}
          <div
            id="overlap day container"
            className="
              grid grid-cols-auto-fill-64
              justify-start
              gap-1
            "
          >
            {preferenceSelection?.selectionIntervals.map((interval) => (
              <OverlapPreviewCell
                key={interval.getStartDate().toString()}
                interval={interval}
              />
            ))}
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
