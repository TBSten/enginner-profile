import GlobalDialog, { useGlobalDialog } from '@/lib/client/dialog';
import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';

import "prismjs/themes/prism-tomorrow.min.css";
import { useEffect } from 'react';

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const { hideDialog } = useGlobalDialog()
  useEffect(() => {
    hideDialog()
  })
  return <>
    <ThemeProvider theme={theme}>
      <GlobalDialog />
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}
