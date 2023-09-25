import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Racing Stopwatch',
  description:
    'A collection of tools for spectators to help with training and racing.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://timing-tools.netlify.app',
    siteName: 'Timing Tools',
    title: 'Racing Stopwatch',
    description:
      'A collection of tools for spectators to help with training and racing',
    images: [
      {
        url: 'https://timing-tools.netlify.app/meta.png',
        width: 1200,
        height: 630,
        alt: 'Racing Stopwatch',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-0H3NMR0413'
      ></Script>
      <Script id='analytics'>
        {` window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0H3NMR0413');`}
      </Script>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
