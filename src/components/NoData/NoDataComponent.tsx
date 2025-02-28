import * as styles from './NoData.css';
import { ReactNode } from 'react';

interface NoDataProps {
  message: string;
  button?: ReactNode;
  buttonMessage?: string;
}

function NoDataComponent({ message, button, buttonMessage }: NoDataProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.message}>{message}</div>
      {buttonMessage && <button className={styles.button}>{buttonMessage}</button>}
      {button}
    </div>
  );
}

export default NoDataComponent;
