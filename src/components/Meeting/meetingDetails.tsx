import { Box, Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import CustomButton from '@/components/Button';
import { DbContext } from '@/context/dbContext';

const MeetingDetails = () => {
  const { meeting, user } = useContext(DbContext);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h2">{meeting?.details.name}</Typography>
      {/* {isSignedIn && <Typography variant="h6">{username}</Typography>} */}
      <CustomButton onClick={copyLinkToClipboard}>
        Copy meeting link
      </CustomButton>
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
