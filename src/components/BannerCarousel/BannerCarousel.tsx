import { useState, useEffect } from 'react';
import type { FC } from 'react';
import styles from './BannerCarousel.module.scss';
import bannerImage from '../../assets/images/bunner.png';

interface BannerCarouselProps {
  // You can add props here if needed
}

export const BannerCarousel: FC<BannerCarouselProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle dot click
  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div 
          className={styles.slidesContainer}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* We're using the same image for all three slides as per requirements */}
          {[0, 1, 2].map((index) => (
            <div key={index} className={styles.slide}>
              <img 
                src={bannerImage} 
                alt={`Banner slide ${index + 1}`} 
                className={styles.bannerImage}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
