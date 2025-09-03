import type { FC } from 'react';
import styles from './Navigation.module.scss';

// Import icons
import homeIcon from '../../assets/icons/navIcons/homeIcon.svg';
import catalogIcon from '../../assets/icons/navIcons/catalog.svg';
import favoriteIcon from '../../assets/icons/navIcons/favorite.svg';
import cartIcon from '../../assets/icons/navIcons/cart.svg';
import accountIcon from '../../assets/icons/navIcons/account.svg';

export const Navigation: FC = () => {
  return (
    <div className={styles.navigationContainer}>
      <nav className={styles.navigation}>
        <a href="#" className={styles.navLink}>
          <img src={homeIcon} alt="Home" />
        </a>
        <a href="#" className={styles.navLink}>
          <img src={catalogIcon} alt="Catalog" />
        </a>
        <a href="#" className={styles.navLink}>
          <img src={favoriteIcon} alt="Favorites" />
        </a>
        <a href="#" className={styles.navLink}>
          <img src={cartIcon} alt="Cart" />
        </a>
        <a href="#" className={styles.navLink}>
          <img src={accountIcon} alt="Account" />
        </a>
      </nav>
      <div className={styles.bottomBar}></div>
    </div>
  );
};

export default Navigation;
