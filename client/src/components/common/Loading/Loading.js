import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
};

export default Loading; 