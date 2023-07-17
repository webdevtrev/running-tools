import Head from 'next/head';
import styles from './layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>
      <html lang='en'>
        <body>
          {/* <header className={styles.header}> */}
          {/* <nav> */}
          {/* <Link href='/'>Home</Link> */}
          {/* </nav> */}
          {/* </header>  */}
          <main className={styles.main}>{children}</main>
        </body>
      </html>
    </>
  );
}
