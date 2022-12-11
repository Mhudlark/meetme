import { Box, Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import Button from '@/components/Button';
import { DbContext } from '@/context/dbContext';
import { useWindowUrl } from '@/utils/hooks';

const MeetingDetails = () => {
  const windowUrl = useWindowUrl();

  const { meeting, user } = useContext(DbContext);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="h3">{meeting?.details.name}</Typography>
      {/* {isSignedIn && <Typography variant="h6">{username}</Typography>} */}
      <Button onClick={copyLinkToClipboard}>
        Copy link to share this with meet with others
      </Button>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="caption">
          {'Or, share this link with others:'}
        </Typography>
        <Typography variant="caption">{windowUrl}</Typography>
      </Stack>
      <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}>
        {meeting?.users
          ?.filter((meetingUser) => meetingUser.username !== user?.username)
          .map((meetingUser) => (
            <Box
              key={meetingUser.username}
              sx={{
                backgroundColor: '#f2f2f288',
                borderRadius: 1,
                p: 0.5,
              }}
            >
              {meetingUser.username}
            </Box>
          ))}
      </Stack>
    </Stack>
  );
};

export default MeetingDetails;
