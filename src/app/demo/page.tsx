import React from 'react';
import Image from 'next/image';
import styles from './styles/demo.module.css';
import Link from 'next/link';

const Demo = () => {
  return (
    <div className={styles.demoContainer}>
      <h1 className={styles.title}>AIチャットボットデモ</h1>
      
      <div className={styles.qrSection}>
        <Image 
          src="/images/line_qr.png"
          alt="LINE QR Code"
          width={300}
          height={300}
        />
        <p>QRコードを読み取って、LINEの友達に追加してください。<br></br>※HARU TECHNOLOGYというアカウントが表示されるはずです</p>
      </div>

      <div className={styles.instructionSection}>
        <h2>使い方</h2>
        <ol>
          <li>上記のQRコードを読み取り、LINEの友だちに追加します。</li>
          <li>チャット画面で質問を入力します。</li>
          <li>AIが自動で回答します。様々な質問を試してみてください！</li>
        </ol>
      </div>

      <div className={styles.spreadsheetSection}>
        <h2>質問と回答の一覧</h2>
        <p>AIが回答した質問と回答の一覧をご覧いただけます。</p>
        <Link href="https://docs.google.com/spreadsheets/d/1AftELRRFP2vhbo0hW3S7OTcnxaSeYZD3hnDM8IucoGs/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.spreadsheetLink}>
          スプレッドシートを表示
        </Link>
      </div>

      {/* <div className={styles.videoSection}>
        <h2>デモ動画</h2>
        <div className={styles.videoWrapper}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="AIチャットボットデモ"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div> */}
    </div>
  );
};

export default Demo;
