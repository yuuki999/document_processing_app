import type { Metadata } from "next";
import "./globals.css";
import styles from './styles/home.module.css';
import Link from "next/link";
import { AuthProvider } from "./_auth/AuthProvider";
import ClientNavigation from "./_components/ClientNavigation";

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
    <AuthProvider>
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
                <ClientNavigation />
              </div>
            </header>

            <main className={styles.mainContent}>{children}</main>

            <footer className={styles.footer}>
              <p>© 2024 SmartReply. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
