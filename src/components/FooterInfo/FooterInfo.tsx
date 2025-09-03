import { FC } from 'react';
import styles from './FooterInfo.module.scss';
import telegramIcon from '../../assets/icons/telegram.svg';

interface FooterInfoProps {
  // You can add props here if needed
}

export const FooterInfo: FC<FooterInfoProps> = () => {
  return (
    <div className={styles.footerInfo}>
      <div className={styles.platformInfo}>
        Разработано на платформе Noxer
      </div>
      <a 
        href="https://t.me/noxerai_bot" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.telegramLink}
      >
        <img 
          src={telegramIcon} 
          alt="Telegram" 
          className={styles.telegramIcon} 
        />
        <span className={styles.telegramText}>noxerai_bot</span>
      </a>
    </div>
  );
};

export default FooterInfo;
