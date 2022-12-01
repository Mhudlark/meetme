import type { Action } from '../action';
import type { Alert } from './helpers';
import { createAlert } from './helpers';

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export type OpenAlert = (type: string, message: string) => Action<Alert>;

export const openAlert: OpenAlert = (type, message) => ({
  type: OPEN,
  payload: createAlert(type, message),
});

export type CloseAlert = () => Action<null>;

export const closeAlert: CloseAlert = () => ({
  type: CLOSE,
  payload: null,
});
