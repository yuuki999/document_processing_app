'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadSuccess(false); // 新しいファイルが選択されたら成功メッセージをリセット
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
  };

  // ファイル送信
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('ファイルを選択してください。');
      return;
    }

    setIsLoading(true);
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
        resetFileInput(); // ファイルアップロード成功後にファイル選択をリセット
      } else {
        throw new Error(data.message || 'エラーが発生しました。');
      }
    } catch (error) {
      setError('ファイルのアップロードまたは処理中にエラーが発生しました。');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF処理アプリ</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.txt"
          className="mb-2 p-2 border rounded"
          ref={fileInputRef}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '処理中...' : 'アップロード'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {uploadSuccess && (
        <p className="text-green-500 mb-4">ファイルが正常にアップロードされました。</p>
      )}
      {file && (
        <p className="mb-2">
          選択されたファイル: {file.name}
        </p>
      )}
    </div>
  );
}
