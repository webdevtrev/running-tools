'use client';
import Script from 'next/script';
export default function Meta() {
  return (
    <>
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
    </>
  );
}
