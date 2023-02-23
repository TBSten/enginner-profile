import GlobalDialog, { useGlobalDialog } from '@/lib/client/dialog';
import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import "prismjs/themes/prism-tomorrow.min.css";
import { useEffect } from 'react';

const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { resetDialog } = useGlobalDialog()
  useEffect(() => {
    resetDialog()
  })
  return <>
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <GlobalDialog />
          <CssBaseline />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  </>
}
