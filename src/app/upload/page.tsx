"use client";

import React, { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './styles/upload.module.css';
import { useAuth } from '../_auth/useAuth';
import { useRouter } from 'next/navigation';

// TODO: S3にアップロードしているが、pinecoreにベクトルデータとしてアップロードできるようにする必要がある。
export default function PDFProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploadLoading, setisUploadLoading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadSuccess(false);
      setError('');
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('ファイルを選択してください。');
      return;
    }

    setisUploadLoading(true);
    setError('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadSuccess(true);
        resetFileInput();
      } else {
        throw new Error(data.message || 'エラーが発生しました。');
      }
    } catch (error) {
      setError('ファイルのアップロードまたは処理中にエラーが発生しました。');
      console.error('Error:', error);
    } finally {
      setisUploadLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI学習支援ツール</h1>
      <p className={styles.description}>
        文書をアップロードして、AIの回答をより正確で役立つものにしましょう。
        PDFやテキストファイルを共有することで、AIがより良い応答ができるようになります。
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.uploadArea}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt"
            ref={fileInputRef}
            className={styles.fileInput}
          />
          <Upload className={styles.icon} size={40} />
          <p className={styles.uploadText}>クリックしてファイルを選択</p>
          <p className={styles.uploadText}>PDFまたはテキストファイル (.pdf, .txt)</p>
        </label>
        {file && (
          <div className={styles.fileInfo}>
            <FileText className={styles.icon} size={16} />
            <span>{file.name}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isUploadLoading || !file}
          className={`${styles.submitButton} ${isUploadLoading ? styles.submitButtonLoading : ''}`}
        >
          {isUploadLoading ? 'アップロード中...' : 'アップロードする'}
        </button>
      </form>
      {error && (
        <div className={`${styles.message} ${styles.errorMessage}`}>
          <AlertCircle className={styles.icon} size={20} />
          <p>{error}</p>
        </div>
      )}
      {uploadSuccess && (
        <div className={`${styles.message} ${styles.successMessage}`}>
          <CheckCircle className={styles.icon} size={20} />
          <p>ファイルが正常にアップロードされました。</p>
        </div>
      )}
    </div>
  );
}
