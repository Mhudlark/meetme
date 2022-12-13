import { CircularProgress } from '@mui/material';
import colors from 'tailwindcss/colors';

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={80} sx={{ color: colors.gray[800] }} />
    </div>
  );
};

export default LoadingScreen;
