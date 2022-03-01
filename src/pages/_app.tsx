import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Header } from '../components/Header';
import 'styles/global.scss';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>me.news</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
