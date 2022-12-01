import { CLOSE, OPEN } from '../actions';
import { alertReducerInitialState, AlertType, createAlert } from '../helpers';
import alertsReducer from '../reducer';

describe('Alerts reducer', () => {
  it('should handle alert opened', () => {
    const alert = createAlert(AlertType.SUCCESS, 'test');
    expect(
      alertsReducer(alertReducerInitialState, {
        type: OPEN,
        payload: alert,
      })
    ).toEqual(alert);
  });

  it('should handle alert closed', () => {
    const alert = createAlert(AlertType.SUCCESS, 'test');
    expect(
      alertsReducer(alert, {
        type: CLOSE,
        payload: null,
      })
    ).toEqual({ ...alert, open: false });
  });
});
