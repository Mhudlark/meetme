import { Stack, Typography } from '@mui/material';
import { useContext } from 'react';

import CustomButton from '@/components/Button';
import { UIAlertContext } from '@/context/Alert/alertContext';
import { DbContext } from '@/context/dbContext';
import { customColors } from '@/styles/colors';

const MeetingDetails = () => {
  const { meeting } = useContext(DbContext);
  const { dispatchAlert, dispatchErrorAlert } = useContext(UIAlertContext);

  const copyCodeToClipboard = () => {
    if (!meeting?.details.code) {
      dispatchErrorAlert('Meeting code is invalid');
      return;
    }
    navigator.clipboard.writeText(meeting.details.code);
    dispatchAlert('info', 'Meeting code copied to clipboard');
  };

  const copyLinkToClipboard = () => {
    if (!window.location.href) {
      dispatchErrorAlert('Meeting link is unavailable');
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    dispatchAlert('info', 'Meeting link copied to clipboard');
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h2">{meeting?.details.name}</Typography>
      <Stack sx={{ gap: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: customColors.gray[600],
          }}
        >
          Meeting code:
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: customColors.gray[700],
            cursor: 'pointer',
            width: 'fit-content',
          }}
          onClick={copyCodeToClipboard}
          title="Click to copy"
        >
          {meeting?.details.code}
        </Typography>
      </Stack>
      <CustomButton color="info" onClick={copyLinkToClipboard}>
        Copy meeting link
      </CustomButton>
    </Stack>
  );
};

export default MeetingDetails;
