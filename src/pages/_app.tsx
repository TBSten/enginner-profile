import GlobalDialog, { useGlobalDialog } from '@/lib/client/dialog';
import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';

import createEmotionCache from '@/lib/client/emotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import "prismjs/themes/prism-tomorrow.min.css";
import { useEffect } from 'react';

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient()

export default function App(props: AppProps & { emotionCache?: EmotionCache }) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: {
      session,
      ...pageProps
    },
  } = props
  const { resetDialog } = useGlobalDialog()
  useEffect(() => {
    resetDialog()
  })
  return <>
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <GlobalDialog />
            <CssBaseline />
            <Component {...pageProps} />
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  </>
}
