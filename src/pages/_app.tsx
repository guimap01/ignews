import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>me.news</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;