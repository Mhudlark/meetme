import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

import { AlertType, UIAlert } from '@/types/uiAlert';

export type UIAlertContextType = {
  alert: UIAlert;
  dispatchAlert: (type: AlertType, message: string, open?: boolean) => void;
  dispatchErrorAlert: (message: string, open?: boolean) => void;
  closeAlert: () => void;
};

const UIAlertContextInitialValue: UIAlertContextType = {
  alert: new UIAlert(AlertType.ERROR, '', false),
  dispatchAlert: (_, __, ___) => {},
  dispatchErrorAlert: (_, __) => {},
  closeAlert: () => {},
};

export const UIAlertContext = createContext<UIAlertContextType>(
  UIAlertContextInitialValue
);

export type UIAlertProviderProps = { children: ReactNode };

const UIAlertProvider = ({ children }: UIAlertProviderProps) => {
  const [alert, setAlert] = useState<UIAlert>(UIAlertContextInitialValue.alert);

  const dispatchErrorAlert = (message: string, open: boolean = true) => {
    const newAlert = new UIAlert(AlertType.ERROR, message, open);
    setAlert(newAlert);
  };

  const dispatchAlert = (
    type: AlertType,
    message: string,
    open: boolean = true
  ) => {
    const newAlert = new UIAlert(type, message, open);
    setAlert(newAlert);
  };

  const closeAlert = () => {
    setAlert(alert.asClosed());
  };

  return (
    <UIAlertContext.Provider
      value={{ alert, dispatchAlert, dispatchErrorAlert, closeAlert }}
    >
      {children}
    </UIAlertContext.Provider>
  );
};

export default UIAlertProvider;
