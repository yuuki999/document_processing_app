"use client";

import Link from "next/link";
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../_auth/useAuth';
import styles from '../styles/home.module.css';
import { useEffect } from "react";

const ClientNavigation = () => {
  const { isLoggedIn, logout, checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    await logout();
    checkAuthStatus(); // ログアウト後に認証状態を再チェック
  };

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLink}>ホーム</Link>
      <Link href="/demo" className={styles.navLink}>デモ</Link>
      <Link href="/contact" className={styles.navLink}>お問い合わせ</Link>
      {isLoggedIn ? (
        <>
          <Link href="/upload" className={styles.navLink}>アップロード</Link>
          <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
            <LogOut className={styles.logoutIcon} />
            <span>ログアウト</span>
          </button>
        </>
      ) : (
        <Link href="/login" className={styles.navLink}>
          <UserCircle className={styles.loginIcon} />
          ログイン
        </Link>
      )}
    </nav>
  );
};

export default ClientNavigation;
