import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';

import "prismjs/themes/prism-tomorrow.min.css";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <>
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  </>
}
