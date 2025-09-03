import type { FC } from 'react';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid: FC<ProductGridProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className={styles.productGrid}>
        <div className={styles.loading}>Загрузка товаров...</div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.productGrid}>
        <div className={styles.noProducts}>
          Товары не найдены. Попробуйте изменить параметры поиска.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map(product => (
        <ProductCard key={product.Product_ID} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
