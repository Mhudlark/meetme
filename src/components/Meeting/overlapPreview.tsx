import { Box, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DbContext } from '@/context/dbContext';
import { Time24 } from '@/types/time24';
import type { User } from '@/types/user';
import { formatDateToFriendlyString } from '@/utils/date';
import type { Overlap } from '@/utils/preferences';
import { getOverlapColour } from '@/utils/preferences';

import CustomTooltip from '../Tooltip';
import FilteredUserToggle from './filteredUserToggle';

export type FilteredUser = User & {
  included: boolean;
};

export interface PreferenceOverlapPreviewProps {
  preferencesOverlap: Overlap | null;
}

export default function PreferenceOverlapPreview({
  preferencesOverlap,
}: PreferenceOverlapPreviewProps) {
  const { meeting } = useContext(DbContext);

  const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);

  const toggleFilteredUser = (filteredUser: FilteredUser) => {
    const newFilteredUsers = filteredUsers.map((user) =>
      user.userId === filteredUser.userId
        ? { ...user, included: !filteredUser.included }
        : user
    );

    setFilteredUsers(newFilteredUsers);
  };

  useEffect(() => {
    if (!meeting?.users) return;

    const currentFilteredUserIds = filteredUsers.map(
      (filteredUser) => filteredUser.userId
    );

    const additionalFilteredUsers: FilteredUser[] =
      meeting.users
        .filter(
          (meetingUser) => !currentFilteredUserIds.includes(meetingUser.userId)
        )
        .map((newMeetingUser) => ({
          ...newMeetingUser,
          included: true,
        })) ?? [];

    const newFilteredUsers = [...filteredUsers, ...additionalFilteredUsers];

    setFilteredUsers(newFilteredUsers);
  }, [meeting]);

  const filteredPreferencesOverlap = useMemo(() => {
    if (!preferencesOverlap) return null;

    const includedUsersIds = filteredUsers
      .filter((filteredUser) => filteredUser.included)
      .map((includedUser) => includedUser.userId);

    // Filter the overlap to only include the users that are selected
    const filteredOverlap: Overlap = preferencesOverlap.map((row) =>
      row.map((interval) => {
        const filteredIntervalUsers = interval.availability.users.filter(
          (intervalUser) => includedUsersIds.includes(intervalUser.userId)
        );

        return {
          ...interval,
          availability: {
            ...interval.availability,
            users: filteredIntervalUsers,
            count: filteredIntervalUsers.length,
          },
        };
      })
    );

    return filteredOverlap;
  }, [filteredUsers, preferencesOverlap]);

  return (
    <Stack sx={{ gap: 2, width: '100%', height: '100%' }}>
      <Typography variant="h3">{`Everyone's preferences`}</Typography>
      <Stack sx={{ flexDirection: 'row', gap: 1 }}>
        {filteredUsers.map((filteredUser) => (
          <FilteredUserToggle
            key={filteredUser.userId}
            filteredUser={filteredUser}
            toggleFilteredUser={toggleFilteredUser}
          />
        ))}
      </Stack>
      <Stack
        sx={{
          borderRadius: 2,
          gap: 2,
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {filteredPreferencesOverlap?.map((row, rowIndex) => (
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
                  title={interval.availability.users
                    .map((user) => user.userId)
                    .join(', ')}
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
    </Stack>
  );
}
