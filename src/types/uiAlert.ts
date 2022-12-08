export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
}

export class UIAlert {
  constructor(
    public type: AlertType,
    public message: string,
    public open: false
  ) {}

  public asClosed = (): UIAlert => {
    return new UIAlert(this.type, this.message, false);
  };
}
