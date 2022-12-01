import { combineReducers } from 'redux';

import alertsReducer from './alerts/reducer';
import roomReducer from './room/reducer';
import userReducer from './user/reducer';

const rootReducer = combineReducers({
  alert: alertsReducer,
  user: userReducer,
  room: roomReducer,
});

export default rootReducer;
