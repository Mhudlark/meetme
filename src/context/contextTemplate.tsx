import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

export type Template = {
  copy: string;
  setCopy: (c: string) => void;
};

export const TemplateContext = createContext<Template | null>(null);

export type TemplateProviderProps = { children: ReactNode };

const TemplateProvider = ({ children }: TemplateProviderProps) => {
  const [copy, setCopy] = useState<string>('hello');

  return (
    <TemplateContext.Provider value={{ copy, setCopy }}>
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateProvider;
