export interface Alert {
  type: string;
  message: string;
  open: false;
}

export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
}

type CreateAlert = (type: string, message: string, open?: boolean) => Alert;

export const createAlert: CreateAlert = (type, message, open = true) => {
  return { type, message, open } as Alert;
};

export const alertReducerInitialState = createAlert('', '', false);
