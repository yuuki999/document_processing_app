"use client";

import Link from "next/link";
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../_auth/useAuth';
import styles from '../styles/home.module.css';
import { useEffect, useState } from "react";
import React from "react";

const ClientNavigation = () => {
  const { isLoggedIn, logout, checkAuthStatus } = useAuth(); // カスタムフックのuseStateの値が更新されるとこのコンポーネントも再レンダリングされる。
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // ハンバーガーメニュー用
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);


  const handleLogout = async () => {
    await logout();
    checkAuthStatus();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <></>;
  }

  // ログイン直後はここで状態が取得できていないので画面が変わらない。
  // モーダルが表示された時に、罰ボタンを表示したい。
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
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
      </div>
      <div className={`${styles.fullscreenMenu} ${isMenuOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={() => setIsMenuOpen(false)}>×</button>
        <div className={styles.menuItems}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>ホーム</Link>
          <Link href="/demo" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>デモ</Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>お問い合わせ</Link>
          {isLoggedIn ? (
            <>
              <Link href="/upload" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>アップロード</Link>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
                <LogOut className={styles.logoutIcon} />
                <span>ログアウト</span>
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              <UserCircle className={styles.loginIcon} />
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientNavigation;
