import type { AppThunk } from './action';
import { openAlert } from './alerts/actions';
import { AlertType } from './alerts/helpers';

export const openErrorAlert =
  (
    message: string,
    abortControllerSignal: AbortSignal | null = null
  ): AppThunk<void> =>
  async (dispatch) => {
    if (
      abortControllerSignal == null ||
      (abortControllerSignal != null && !abortControllerSignal.aborted)
    ) {
      dispatch(openAlert(AlertType.ERROR, message));
    }
  };
