"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles/login.module.css';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../_auth/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const success = await login(email, password);
  
      if (success) {
        setMessage('ログインに成功しました。アップロードページに移動します...');
        console.log('Login successful');
        setTimeout(() => {
          router.push('/upload');
        }, 2000);
      } else {
        setIsError(true);
        setMessage('ユーザー名かパスワードが間違っています');
        console.error('Login failed');
      }
    } catch (error) {
      setIsError(true);
      setMessage('ログイン中にエラーが発生しました。しばらくしてからもう一度お試しください。');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>ログイン</h1>
      {message && (
        <p className={isError ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <Mail className={styles.inputIcon} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <Lock className={styles.inputIcon} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      <p className={styles.loginInfo}>
        ※ アカウントをお持ちでない方は、管理者にお問い合わせください。
      </p>
    </div>
  );
};

export default LoginPage;
