import { Stack, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DbContext } from '@/context/dbContext';
import type { PreferenceSelection } from '@/types/preferenceSelection';
import type { User } from '@/types/user';
import { reduceSelectionIntervals } from '@/utils/typesUtils/selectionInterval';

import FilteredOverlapPreview from './filteredOverlapPreview';
import FilteredUserToggle from './filteredUserToggle';
import NumStandoutsSelect from './numStandoutsSelect';
import StandoutInterval from './standoutInterval';

export type FilteredUser = User & {
  included: boolean;
};

export interface PreferenceOverlapPreviewProps {
  overlappingPreferences: PreferenceSelection[] | null;
}

export default function PreferenceOverlapPreview({
  overlappingPreferences,
}: PreferenceOverlapPreviewProps) {
  const { meeting } = useContext(DbContext);

  const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
  const [numStandouts, setNumStandouts] = useState(3);

  const toggleFilteredUser = (filteredUser: FilteredUser) => {
    const newFilteredUsers = filteredUsers.map((user) =>
      user.userId === filteredUser.userId
        ? { ...user, included: !filteredUser.included }
        : user
    );

    setFilteredUsers(newFilteredUsers);
  };

  // Calculate the users that can be filtered
  useEffect(() => {
    if (!meeting?.users) return;

    const currentFilteredUserIds = filteredUsers.map(
      (filteredUser) => filteredUser.userId
    );

    const usersWithPreferences = meeting.preferences.map(
      (preference) => preference.userId
    );
    const meetingUsersWithPreferences = meeting.users.filter((meetingUser) =>
      usersWithPreferences.includes(meetingUser.userId)
    );

    const additionalFilteredUsers: FilteredUser[] =
      meetingUsersWithPreferences
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

  // Calculate the filtered overlapping preferences from the selected users
  const filteredOverlappingPreferences = useMemo(() => {
    if (!overlappingPreferences) return null;

    const includedUsersIds = filteredUsers
      .filter((filteredUser) => filteredUser.included)
      .map((includedUser) => includedUser.userId);

    // Filter the overlap to only include the users that are selected
    const newFilteredOverlappingPreferences: PreferenceSelection[] =
      overlappingPreferences.map((preferenceSelection) => {
        const filteredSelectionIntervals =
          preferenceSelection.selectionIntervals.map((selectionInterval) => {
            const filteredIntervalUserIds = selectionInterval.userIds.filter(
              (intervalUserId) => includedUsersIds.includes(intervalUserId)
            );

            return selectionInterval.copyWithUserIds(filteredIntervalUserIds);
          });

        return preferenceSelection.copyWithSelectionIntervals(
          filteredSelectionIntervals
        );
      });

    return newFilteredOverlappingPreferences;
  }, [filteredUsers, overlappingPreferences]);

  // Calculate the standout intervals from the filtered overlapping preferences
  const filteredStandoutIntervals = useMemo(() => {
    if (!filteredOverlappingPreferences) return [];

    const allFilteredIntervals = filteredOverlappingPreferences.flatMap(
      (preferenceSelection) =>
        reduceSelectionIntervals(preferenceSelection.selectionIntervals)
    );

    if (allFilteredIntervals.length <= 5) return [];

    const sortedFilteredIntervals = allFilteredIntervals.sort(
      (a, b) => b.count() - a.count()
    );

    return sortedFilteredIntervals.slice(0, numStandouts);
  }, [numStandouts, filteredOverlappingPreferences]);

  return (
    <Stack sx={{ gap: 6, width: '100%', height: '100%' }}>
      {filteredStandoutIntervals &&
        Array.isArray(filteredStandoutIntervals) &&
        filteredStandoutIntervals.length > 0 &&
        (filteredStandoutIntervals?.[0]?.count() ?? 0) > 1 && (
          <Stack sx={{ gap: 4 }}>
            <Stack
              sx={{
                flexDirection: 'row',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <Typography variant="h3">Best times</Typography>
              <NumStandoutsSelect onChange={setNumStandouts} />
            </Stack>
            <Stack sx={{ gap: 2 }}>
              {filteredStandoutIntervals?.map((standoutInterval) => (
                <StandoutInterval
                  key={standoutInterval.getStartDate().valueOf()}
                  standoutInterval={standoutInterval}
                />
              ))}
            </Stack>
          </Stack>
        )}
      <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
        <Typography variant="h3">{`Everyone's preferences`}</Typography>
        <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          {filteredUsers.map((filteredUser) => (
            <FilteredUserToggle
              key={filteredUser.userId}
              filteredUser={filteredUser}
              toggleFilteredUser={toggleFilteredUser}
            />
          ))}
        </Stack>
        {filteredOverlappingPreferences && (
          <FilteredOverlapPreview
            filteredOverlappingPreferences={filteredOverlappingPreferences}
          />
        )}
      </Stack>
    </Stack>
  );
}
