import { Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import CustomButton from '@/components/Button';
import { DbContext } from '@/context/dbContext';

const MeetingDetails = () => {
  const { meeting } = useContext(DbContext);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h2">{meeting?.details.name}</Typography>
      <CustomButton color="info" onClick={copyLinkToClipboard}>
        Copy meeting link
      </CustomButton>
    </Stack>
  );
};

export default MeetingDetails;
