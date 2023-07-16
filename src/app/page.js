import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Tools</h1>
      <div>
        <Link href={'/tools/race-stopwatch'}>Race Stopwatch</Link>
      </div>
    </main>
  );
}
