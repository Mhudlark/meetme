import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import CustomButton from '@/components/Button';
import CreateMeetingModal from '@/components/Meeting/create/createMeetingModal';
import JoinMeetingModal from '@/components/Meeting/create/joinMeetingModal';
import { DbContext } from '@/context/dbContext';
import { customColors } from '@/styles/colors';
import type { PartialMeetingDetails } from '@/types/meeting';
import { paths } from '@/utils/paths';

const Index = () => {
  const router = useRouter();
  const { joinMeeting, createMeeting } = useContext(DbContext);

  const [isJoinMeetingModalOpen, setIsJoinMeetingModalOpen] = useState(false);
  const [isJoinMeetingLoading, setIsJoinMeetingLoading] = useState(false);

  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] =
    useState(false);
  const [isCreateMeetingLoading, setIsCreateMeetingLoading] = useState(false);

  const onJoinMeeting = async (meetingCode: string) => {
    if (!meetingCode) throw new Error('Meeting name is invalid');

    setIsJoinMeetingLoading(true);

    const meetingId = await joinMeeting(meetingCode);

    // setIsJoinMeetingLoading(false);

    router.push(`${paths.meeting}/${meetingId}`);
  };

  const onCreateMeeting = async (meetingDetails: PartialMeetingDetails) => {
    setIsCreateMeetingLoading(true);

    const meetingId = await createMeeting(meetingDetails);

    // setIsCreateMeetingLoading(false);

    router.push(`${paths.meeting}/${meetingId}`);
  };

  return (
    <>
      <JoinMeetingModal
        isOpen={isJoinMeetingModalOpen}
        onClose={() => setIsJoinMeetingModalOpen(false)}
        onJoinMeeting={onJoinMeeting}
        isJoinMeetingLoading={isJoinMeetingLoading}
      />
      <CreateMeetingModal
        isOpen={isCreateMeetingModalOpen}
        onClose={() => setIsCreateMeetingModalOpen(false)}
        onCreateMeeting={onCreateMeeting}
        isCreateMeetingLoading={isCreateMeetingLoading}
      />
      <Stack
        sx={{
          gap: 6,
          alignItems: 'center',
          justifyContent: 'center',
          height: '86vh',
          width: '100%',
        }}
      >
        <Stack
          sx={{
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* <Typography variant="h1">Join a meeting</Typography> */}
          <CustomButton
            onClick={() => setIsJoinMeetingModalOpen(true)}
            style={{
              width: '248px',
              height: '68px',
              fontSize: '24px',
            }}
          >
            Join a meeting
          </CustomButton>
        </Stack>
        <Typography variant="h2" sx={{ mt: 6, color: customColors.gray[700] }}>
          Or
        </Typography>
        <Stack
          sx={{
            gap: 3,
            alignItems: 'center',
          }}
        >
          {/* <Typography variant="h3">Or, create your own</Typography> */}
          <CustomButton
            color="info"
            onClick={() => setIsCreateMeetingModalOpen(true)}
            style={{
              width: '222px',
              maxHeight: '120px',
              fontSize: '20px',
            }}
          >
            Create a meeting
          </CustomButton>
        </Stack>
      </Stack>
    </>
  );
};

export default Index;
