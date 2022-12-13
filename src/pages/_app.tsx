import '../styles/global.css';

import { ThemeProvider } from '@emotion/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import UIAlertProvider from '@/context/Alert/alertContext';
import DbProvider from '@/context/dbContext';
import App from '@/layouts/App';
import theme from '@/styles/theme';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <UIAlertProvider>
        <DbProvider>
          <ThemeProvider theme={theme}>
            <App>{getLayout(<Component {...pageProps} />)}</App>
          </ThemeProvider>
        </DbProvider>
      </UIAlertProvider>
    </SessionContextProvider>
  );
};

export default MyApp;
