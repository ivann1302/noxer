import { FC } from 'react';
import styles from './CategoryScroll.module.scss';

// Import images
import accessoriesImage from '../../assets/images/scroll-images/img.png';
import tshirtsImage from '../../assets/images/scroll-images/image2.png';
import hoodiesImage from '../../assets/images/scroll-images/image3.png';
import jacketsImage from '../../assets/images/scroll-images/image4.png';
import jeansImage from '../../assets/images/scroll-images/image5.png';
import certificatesImage from '../../assets/images/scroll-images/image6.png';

interface CategoryItem {
  id: number;
  name: string;
  image: string;
}

interface CategoryScrollProps {
  // You can add props here if needed
}

export const CategoryScroll: FC<CategoryScrollProps> = () => {
  const categories: CategoryItem[] = [
    { id: 1, name: 'Аксессуары', image: accessoriesImage },
    { id: 2, name: 'Футболки', image: tshirtsImage },
    { id: 3, name: 'Толстовки', image: hoodiesImage },
    { id: 4, name: 'Куртки', image: jacketsImage },
    { id: 5, name: 'Джинсы', image: jeansImage },
    { id: 6, name: 'Сертификаты', image: certificatesImage },
  ];

  return (
    <div className={styles.categoryScrollContainer}>
      <div className={styles.categoryScroll}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            <div className={styles.imageContainer}>
              <img 
                src={category.image} 
                alt={category.name} 
                className={styles.categoryImage}
              />
            </div>
            <div className={styles.categoryName}>
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;