import type { AlertColor } from '@mui/material';

export type AlertType = AlertColor;

export class UIAlert {
  constructor(
    public type: AlertType,
    public message: string,
    public open: boolean = true
  ) {}

  public asClosed = (): UIAlert => {
    return new UIAlert(this.type, this.message, false);
  };
}
