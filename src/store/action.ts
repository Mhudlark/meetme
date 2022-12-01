import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { RootState } from './store';

export type Action<T> = {
  type: string;
  payload: T;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
