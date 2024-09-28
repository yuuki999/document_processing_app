"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './styles/contact.module.css';

interface FormInputs {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface SubmitResult {
  type: 'success' | 'error';
  message: string;
}

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitResult({ type: 'success', message: 'お問い合わせを受け付けました。' });
      } else {
        throw new Error('送信に失敗しました');
      }
    } catch (error) {
      setSubmitResult({ type: 'error', message: 'エラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>お問い合わせ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">お名前 <span className={styles.required}>※</span></label>
          <input
            id="name"
            type="text"
            autoComplete="off"
            {...register('name', { required: 'お名前は必須です' })}
            className={errors.name ? styles.errorInput : ''}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">メールアドレス <span className={styles.required}>※</span></label>
          <input
            id="email"
            type="email"
            autoComplete="off"
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
            className={errors.email ? styles.errorInput : ''}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">電話番号</label>
          <input
            id="phone"
            type="tel"
            autoComplete="off"
            {...register('phone', {
              pattern: {
                value: /^[0-9-]+$/,
                message: '有効な電話番号を入力してください',
              },
            })}
            className={errors.phone ? styles.errorInput : ''}
          />
          {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">お問い合わせ内容 <span className={styles.required}>※</span></label>
          <textarea
            id="message"
            autoComplete="off"
            {...register('message', { required: 'お問い合わせ内容は必須です' })}
            className={errors.message ? styles.errorInput : ''}
          />
          {errors.message && <span className={styles.errorMessage}>{errors.message.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </form>

      {submitResult && (
        <div className={`${styles.submitResult} ${styles[submitResult.type]}`}>
          {submitResult.message}
        </div>
      )}
    </div>
  );
};

export default ContactForm;
