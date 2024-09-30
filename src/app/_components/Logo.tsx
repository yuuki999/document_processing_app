import React from 'react';
import styles from '../styles/logo.module.css';
import Link from 'next/link';

export const Logo: React.FC = () => {
  return (
    <Link href="/" className={styles.logo} aria-label="ホーム画面へ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" width="180" height="50">
        <circle cx="50" cy="50" r="40" fill="#4a90e2" opacity="0.8" />
        <circle cx="90" cy="50" r="40" fill="#50c878" opacity="0.8" />
        <text x="60" y="62" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="white">SR</text>
        <text x="140" y="62" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">
          <tspan fill="#4a90e2">Smart</tspan><tspan fill="#50c878">Reply</tspan>
        </text>
      </svg>
    </Link>
  );
};
