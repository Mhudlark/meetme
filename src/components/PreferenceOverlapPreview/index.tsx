import { Box, Stack, Typography } from '@mui/material';

import { Time24 } from '@/types/time24';
import { formatDateToFriendlyString } from '@/utils/date';
import type { Overlap } from '@/utils/preferences';
import { getOverlapColour } from '@/utils/preferences';

import CustomTooltip from '../Tooltip';

export interface PreferenceOverlapPreviewProps {
  preferencesOverlap: Overlap | null;
}

export default function PreferencesOverlapPreview({
  preferencesOverlap,
}: PreferenceOverlapPreviewProps) {
  return (
    <Stack sx={{ backgroundColor: '#f2f2f2', borderRadius: 2, p: 1, gap: 2 }}>
      {preferencesOverlap?.map((row, rowIndex) => (
        <Stack key={rowIndex}>
          {row?.[0]?.start && (
            <Typography variant="body1">
              {formatDateToFriendlyString(row[0].start)}
            </Typography>
          )}
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'stretch',
              gap: 0.5,
            }}
          >
            {row?.map((interval, intervalIndex) => (
              <CustomTooltip
                key={`${rowIndex}-${intervalIndex}`}
                title={interval.availability.ids.join(', ')}
                placement="top"
              >
                <Box
                  sx={{
                    backgroundColor: getOverlapColour(
                      interval.availability.count
                    ),
                    p: 1,
                    flexGrow: 1,
                    borderRadius: '4px',
                  }}
                >
                  {new Time24(interval.start).toString()}
                </Box>
              </CustomTooltip>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
