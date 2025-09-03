import type { FC } from 'react';
import styles from './TopNavigation.module.scss';

import closeIcon from '../../assets/icons/topNavIcons/closeIcon.svg';
import backArrowIcon from '../../assets/icons/topNavIcons/backArrowIcon.svg';
import downArrowIcon from '../../assets/icons/topNavIcons/downArrowIcon.svg';
import threeDotsIcon from '../../assets/icons/topNavIcons/threeDotsIcon.svg';
import telegramIcon from '../../assets/icons/maintg.svg';

interface TopNavigationProps {
  isSearchMode: boolean;
  isSearchResults?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

export const TopNavigation: FC<TopNavigationProps> = ({
  isSearchMode,
  isSearchResults = false,
  onClose,
  onBack
}) => {
  return (
    <div className={styles.topNavigation}>
      {isSearchMode ? (
        isSearchResults ? (
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close"
          >
            <img 
              src={closeIcon} 
              alt="Close" 
              className={styles.closeIcon} 
            />
            <span className={styles.closeText}>Закрыть</span>
          </button>
        ) : (
          <button 
            className={styles.backButton} 
            onClick={onBack}
            aria-label="Back"
          >
            <img 
              src={backArrowIcon} 
              alt="Back" 
              className={styles.backArrowIcon} 
            />
            <span className={styles.backText}>Назад</span>
          </button>
        )
      ) : (
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close"
        >
          <img 
            src={closeIcon} 
            alt="Close" 
            className={styles.closeIcon} 
          />
          <span className={styles.closeText}>Закрыть</span>
        </button>
      )}

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
        <span className={styles.telegramText}>наш tg-канал</span>
      </a>

      <button 
        className={styles.menuButton} 
        aria-label="Menu"
      >
        <img 
          src={downArrowIcon} 
          alt="Down Arrow" 
          className={styles.downArrowIcon} 
        />
        <img 
          src={threeDotsIcon} 
          alt="Menu" 
          className={styles.threeDotsIcon} 
        />
      </button>
    </div>
  );
};

export default TopNavigation;
