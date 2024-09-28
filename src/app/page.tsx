import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from './styles/home.module.css';
import MaterialIcon from './_components/icon';
import Link from 'next/link';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>AIで簡単・低コスト！顧客対応を自動化するLINEボット</title>
        <meta name="description" content="24時間365日、お客様の質問に自動で回答。業務効率化と顧客満足度向上を同時に実現！" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className={styles.heroWrapper}>
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>AIで簡単・低コスト！<br />顧客対応を自動化する<br />LINEボット</h1>
              <p className={styles.subtitle}>24時間365日、お客様の質問に自動で回答。<br />業務効率化と顧客満足度向上を同時に実現！</p>
              <Link href="/contact" >
                <button className={styles.ctaButton}>お問い合わせ（無料）</button>
              </Link>
            </div>
            {/* 画像の画質が悪いので改善したい。 */}
            <div className={styles.mockup}>
              <Image 
                src="/images/line_talk.svg"
                alt="iPhone frame with LINE chat"
                width={0}
                height={0}
                className={styles.phoneFrame}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>こんな悩みありませんか？</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <MaterialIcon name="schedule" size={48} color="#1a73e8" />
              <h3 className={styles.cardTitle}>営業時間外の問い合わせ対応ができない</h3>
              <p>24時間365日、AIが自動でお客様の質問に回答します。</p>
            </div>
            <div className={styles.card}>
              <MaterialIcon name="support_agent" size={48} color="#1a73e8" />
              <h3 className={styles.cardTitle}>人手不足で顧客対応に時間がかけられない</h3>
              <p>AIが初期対応を行い、スタッフの負担を軽減します。</p>
            </div>
            <div className={styles.card}>
              <MaterialIcon name="savings" size={48} color="#1a73e8" />
              <h3 className={styles.cardTitle}>高額なチャットボットサービスは導入できない</h3>
              <p>低コストで高品質なサービスを提供。予算に優しく、ビジネス成長をサポートします。</p>
            </div>
            <div className={styles.card}>
              <MaterialIcon name="psychology" size={48} color="#1a73e8" />
              <h3 className={styles.cardTitle}>迅速なAI構築・導入</h3>
              <p>最短1日、最長3日で構築完了。</p>
            </div>
          </div>
        </section>

        {/* ここの文言はあとで考えたい */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>主な機能</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>AIチャットボット</h3>
              <p>24時間365日、自動で顧客の質問に回答</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>カスタマイズ可能な<br></br>回答データベース</h3>
              <p>お店や商品の情報を簡単に登録</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>質問・回答ログの管理</h3>
              <p>すべての対話をスプレッドシートで簡単管理</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>LINE公式アカウント<br></br>連携</h3>
              <p>LINEでのやり取りをそのままボットに統合</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
        <h2 className={styles.sectionTitle}>料金プラン</h2>
        <div className={styles.pricingContainer}>
          <div className={styles.setupFee}>
            <h3>初期セットアップ</h3>
            <p className={styles.price}>10,000円</p>
            <ul>
              <li><MaterialIcon name="check_circle" color="green" /> LINE公式アカウント構築</li>
              <li><MaterialIcon name="check_circle" color="green" /> スプレッドシート組み込み</li>
              <li><MaterialIcon name="check_circle" color="green" /> インフラ設定</li>
              <li><MaterialIcon name="check_circle" color="green" /> 利用サポート</li>
            </ul>
          </div>
          <div className={styles.monthlyFee}>
            <h3>月額インフラ利用料目安</h3>
            <p className={styles.price}>100円 ~ 3,000円</p>
            <p>※ 利用量に応じて変動</p>
          </div>
        </div>
        <div className={styles.note}>
          <MaterialIcon name="info" color="#1a73e8" />
          <p>初期セットアップ後は、ご利用状況に応じた月額インフラ利用料のみが発生します。</p>
        </div>
      </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>今すぐ始めましょう！</h2>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/contact" >
              <button className={styles.ctaButton}>お問い合わせ（無料）</button>
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Home;
