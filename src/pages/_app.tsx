import { IdentityProvider } from '@/components/contexts/auth/IdentityContext';
import { GlobalPortalContext } from '@/components/contexts/portal/GlobalPortalContext';
import GlobalStyle from '@/components/globalStyles';
import theme from '@/components/theme';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='og:type' content='website' />
        <meta property='og:image' content='/images/og.png' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon/favicon-16x16.png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link
          rel='mask-icon'
          href='/favicon/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <GlobalStyle />
      <SessionProvider session={pageProps.sesion}>
        <IdentityProvider>
          <GlobalPortalContext>
            <Component {...pageProps} />
          </GlobalPortalContext>
        </IdentityProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
