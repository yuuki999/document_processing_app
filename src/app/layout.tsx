import type { Metadata } from "next";
import "./globals.css";
import styles from './styles/home.module.css';
import Link from "next/link";
import { AuthProvider } from "./_auth/AuthProvider";
import ClientNavigation from "./_components/ClientNavigation";
import { Logo } from "./_components/Logo";

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
        </head>
        <body className={`${styles.body}`}>
          <div className={styles.pageContainer}>
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <Logo />
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
