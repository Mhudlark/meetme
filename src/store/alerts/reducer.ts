import type { Reducer } from 'redux';

import type { Action } from '../action';
import type { ApplicationStore } from '../sharedHelpers';
import { initialStore } from '../sharedHelpers';
import { CLOSE, OPEN } from './actions';

const alertsReducer: Reducer<ApplicationStore['alert'], Action<any>> = (
  alert = initialStore.alert,
  action
) => {
  if (action.type === OPEN) {
    return action.payload;
  }

  if (action.type === CLOSE) {
    return { ...alert, open: false };
  }

  return alert;
};

export default alertsReducer;
