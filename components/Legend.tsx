import styles from './Legend.module.css';

const Legend: React.FC = () => {
  return (
    <section className={styles.container}>
      <span className={styles.scale}></span>
      <span className={styles.min}>0</span>
      <span className={styles.units}>Equity Score</span>
      <span className={styles.max}>100</span>
    </section>
  );
};

export default Legend;
