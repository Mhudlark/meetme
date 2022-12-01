import type { Reducer } from 'redux';

import type { Action } from '../action';
import type { ApplicationStore } from '../sharedHelpers';
import { initialStore } from '../sharedHelpers';
import { SET_USER_ID, SET_USERNAME } from './actions';

const userReducer: Reducer<ApplicationStore['user'], Action<string>> = (
  user = initialStore.user,
  action
) => {
  if (action.type === SET_USERNAME) {
    return {
      ...user,
      username: action.payload as string,
    };
  }

  if (action.type === SET_USER_ID) {
    return {
      ...user,
      userId: action.payload as string,
    };
  }

  return user;
};

export default userReducer;
