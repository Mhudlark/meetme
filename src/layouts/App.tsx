import { Container } from '@mui/material';

import SnackBar from '@/components/SnackBar';

import { Meta } from './Meta';

type AppLayoutProps = {
  children: any;
};

const App = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Meta title="MeetMe" description="MeetMe" />
      <Container
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 6, md: 8 },
          my: 0,
          mx: 'auto',
        }}
      >
        {children}
      </Container>
      <SnackBar />
    </>
  );
};

export default App;
