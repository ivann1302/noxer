import { FC, useState } from 'react';
import type { Product, ProductParameter } from '../../types/product';
import styles from './ProductCard.module.scss';
import likeOffIcon from '../../assets/icons/likeOff.svg';
import likeOnIcon from '../../assets/icons/likeOn.svg';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Find the main image
  const mainImage = product.images.find(img => img.MainImage) || product.images[0];

  // Validate image URL
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;

    // Check if it's a Yandex image URL that's known to cause issues
    if (url.includes('avatars.mds.yandex.net')) {
      console.log('Detected problematic Yandex image URL, using placeholder instead');
      return false;
    }

    // Check if URL is properly formatted
    try {
      new URL(url);
      // Additional validation for common image formats
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        url.toLowerCase().endsWith(ext) || url.toLowerCase().includes(ext + '?')
      );

      // If URL doesn't have a valid image extension, it might still be valid
      // but we'll be more cautious with it
      return hasValidExtension || !url.includes('yandex');
    } catch (e) {
      return false;
    }
  };

  // State to track if the image has failed to load
  const [imageError, setImageError] = useState(false);

  // Get the price from parameters
  const getPrice = (): { price: number; oldPrice: number | null } => {
    const parameter = product.parameters.find((param: ProductParameter) => param.chosen);

    if (parameter) {
      return {
        price: parameter.price,
        oldPrice: parameter.old_price
      };
    }

    // If no chosen parameter, use the first one
    const firstParameter = product.parameters[0];
    return {
      price: firstParameter?.price || 0,
      oldPrice: firstParameter?.old_price || null
    };
  };

  const { price, oldPrice } = getPrice();

  // Format price with currency
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  // Calculate discount percentage if there's an old price
  const getDiscountPercentage = (): number | null => {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // Ensure we always have a discount percentage if there's an old price
  const discountPercentage = getDiscountPercentage();

  // Toggle like status
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {mainImage && !imageError && isValidImageUrl(mainImage.Image_URL) ? (
          <img 
            src={mainImage.Image_URL} 
            alt={product.Product_Name} 
            className={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${styles.image} ${styles.placeholderImage}`}>
            <span>{product.Product_Name.charAt(0)}</span>
          </div>
        )}

        {/* Product marks (sale, new, etc.) */}
        {product.marks.length > 0 && (
          <div className={styles.marks}>
            {product.marks.map(mark => (
              <span 
                key={mark.Mark_ID} 
                className={`${styles.mark} ${styles[mark.Mark_Name.toLowerCase()]}`}
              >
                {mark.Mark_Name.toLowerCase() === 'hit' ? 'ХИТ' : mark.Mark_Name}
              </span>
            ))}
          </div>
        )}

        {/* Discount badge removed as it's now shown in the price section */}

        {/* Like button */}
        <button 
          className={styles.likeButton} 
          onClick={handleLikeClick}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <img 
            src={isLiked ? likeOnIcon : likeOffIcon} 
            alt="Like" 
            width="16.57" 
            height="14.83" 
          />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.price}>
          <span className={styles.currentPrice}>{formatPrice(price)}</span>
          {oldPrice && (
            <>
              <span className={styles.oldPrice}>{formatPrice(oldPrice)}</span>
              {/* Always show discount percentage if there's an old price */}
              <span className={styles.discountPercentage}>-{discountPercentage || 0}%</span>
            </>
          )}
        </div>

        <h3 className={styles.name}>{product.Product_Name}</h3>
      </div>

      {/* Select button */}
      <button className={styles.selectButton}>
        Выбрать
      </button>
    </div>
  );
};

export default ProductCard;
