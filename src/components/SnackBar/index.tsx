import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { useContext } from 'react';

import { UIAlertContext } from '@/context/Alert/alertContext';

const SnackBar = () => {
  const { alert, closeAlert } = useContext(UIAlertContext);

  const closeSnackBar = () => {
    closeAlert();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={alert.open}
      autoHideDuration={6000}
      onClose={closeSnackBar}
      ClickAwayListenerProps={{ onClickAway: () => {} }}
    >
      {alert.open ? (
        <Alert
          onClose={closeSnackBar}
          severity={alert.type as AlertColor}
          variant="filled"
          sx={{ width: '100%', minWidth: '160px' }}
        >
          {alert?.message ?? alert?.type}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};

export default SnackBar;
