import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';

import "prismjs/themes/prism-tomorrow.min.css";

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}
