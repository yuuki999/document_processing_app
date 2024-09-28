import type { Metadata } from "next";
import "./globals.css";
import styles from './styles/home.module.css';
import Link from "next/link";

export const metadata: Metadata = {
  title: "SmartReply",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
      </head>
      <body className={`${styles.body}`}>
        <div className={styles.pageContainer}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.logo} aria-label="ホーム画面へ">
                SmartReply
              </Link>
              <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>ホーム</Link>
                <Link href="/demo" className={styles.navLink}>デモ</Link>
                <Link href="/contact" className={styles.navLink}>お問い合わせ</Link>
              </nav>
            </div>
          </header>

          <main className={styles.mainContent}>{children}</main>

          <footer className={styles.footer}>
            <p>© 2024 SmartReply. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
