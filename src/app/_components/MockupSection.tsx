import styles from '../styles/home.module.css';
import Image from 'next/image';

const MockupSection = () => {
  return (
    <div className={styles.mockupContainer}>
      <div className={styles.mockup}>
        <Image 
          src="/images/line_talk.svg"
          alt="iPhone frame with LINE chat"
          width={100}
          height={200}
          className={styles.phoneFrame}
        />
      </div>
      <div className={styles.mockup}>
        <Image 
          src="/images/macbook.svg"
          alt="MacBook frame with spreadsheet"
          width={100}
          height={200}
          className={styles.macbookFrame}
        />
      </div>
    </div>
  );
};

export default MockupSection;
