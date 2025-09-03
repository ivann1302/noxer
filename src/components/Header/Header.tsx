import type { FC } from 'react';
import styles from './Header.module.scss';

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          Noxer Shop
        </a>

        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>
            Главная
          </a>
          <a href="#" className={styles.navLink}>
            Каталог
          </a>
          <a href="#" className={styles.navLink}>
            О нас
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
