import Link from 'next/link';
import styles from './layout.module.css';

export default function Layout({ children }) {
  return (
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
  );
}
