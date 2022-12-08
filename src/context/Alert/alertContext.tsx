import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

import { AlertType, UIAlert } from '@/types/uiAlert';

export type UIAlertContextType = {
  alert: UIAlert;
  openAlert: (alert: UIAlert) => void;
  closeAlert: () => void;
};

const UIAlertContextInitialValue: UIAlertContextType = {
  alert: new UIAlert(AlertType.ERROR, '', false),
  openAlert: (_) => {},
  closeAlert: () => {},
};

export const UIAlertContext = createContext<UIAlertContextType>(
  UIAlertContextInitialValue
);

export type UIAlertProviderProps = { children: ReactNode };

const UIAlertProvider = ({ children }: UIAlertProviderProps) => {
  const [alert, setAlert] = useState<UIAlert>(UIAlertContextInitialValue.alert);

  const openAlert = (newAlert: UIAlert) => {
    setAlert(newAlert);
  };

  const closeAlert = () => {
    setAlert(alert.asClosed());
  };

  return (
    <UIAlertContext.Provider value={{ alert, openAlert, closeAlert }}>
      {children}
    </UIAlertContext.Provider>
  );
};

export default UIAlertProvider;
