import { Stack, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DbContext } from '@/context/dbContext';
import type { PreferenceSelection } from '@/types/preferenceSelection';
import type { User } from '@/types/user';
import { formatDateToFriendlyString } from '@/utils/date';
import { getOverlapColour } from '@/utils/preferences';
import { reduceSelectionIntervals } from '@/utils/typesUtils/selectionInterval';
import { getUsersFromUserIds } from '@/utils/typesUtils/user';

import CustomTooltip from '../Tooltip';
import FilteredUserToggle from './filteredUserToggle';
import NumStandoutsSelect from './numStandoutsSelect';

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
    <Stack sx={{ gap: { xs: 4, sm: 4 }, width: '100%', height: '100%' }}>
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
      {filteredStandoutIntervals &&
        Array.isArray(filteredStandoutIntervals) &&
        filteredStandoutIntervals.length > 0 &&
        (filteredStandoutIntervals?.[0]?.count() ?? 0) > 1 && (
          <Stack sx={{ gap: 2 }}>
            <Stack
              sx={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">Standout times</Typography>
              <NumStandoutsSelect onChange={setNumStandouts} />
            </Stack>
            {filteredStandoutIntervals?.map((standoutInterval) => (
              <Stack
                key={standoutInterval.getStartDate().valueOf()}
                sx={{ gap: 0.5 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatDateToFriendlyString(standoutInterval.date)}
                </Typography>
                <Typography variant="body2">
                  {standoutInterval.startTime.toString()}
                  {' - '}
                  {standoutInterval.endTime.toString()}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      <Stack
        sx={{
          borderRadius: 2,
          gap: 3,
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {filteredOverlappingPreferences?.map(
          (preferenceSelection, prefIndex) => (
            <Stack key={prefIndex} sx={{ gap: 1 }}>
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
                {preferenceSelection?.selectionIntervals.map(
                  (interval, intervalIndex) => (
                    <CustomTooltip
                      key={`${prefIndex}-${intervalIndex}`}
                      title={getUsersFromUserIds(
                        interval.userIds,
                        meeting?.users ?? []
                      )
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
                  )
                )}
              </div>
            </Stack>
          )
        )}
      </Stack>
    </Stack>
  );
}
