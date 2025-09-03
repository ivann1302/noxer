import { useState } from 'react';
import type { FC } from 'react';
import SearchBar from '../../components/SearchBar';
import ProductGrid from '../../components/ProductGrid';
import Pagination from '../../components/Pagination';
import BannerCarousel from '../../components/BannerCarousel';
import CategoryScroll from '../../components/CategoryScroll';
import FooterInfo from '../../components/FooterInfo';
import Navigation from '../../components/Navigation';
import TopNavigation from '../../components/TopNavigation';
import { useProducts } from '../../hooks/useProducts';
import styles from './MainPage.module.scss';

const POPULAR_SEARCHES = [
  'футболка',
  'женская кофта',
  'сертификат',
  'куртка',
  'детская футболка',
  'подарочный сертификат',
  'штаны спортивные',
  'сертификат на 100 рублей',
  'шапка брелок'
];

export const MainPage: FC = () => {
  const {
    products,
    mainProducts,
    loading,
    pagination,
    searchQuery,
    searchProducts,
    fetchPage
  } = useProducts();

  const [isTyping, setIsTyping] = useState(false);
  const [isSearchResults, setIsSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    searchProducts(query);
    setIsSearchResults(!!query);
  };

  const handlePageChange = (page: number) => {
    fetchPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Ensure search results remain visible when navigating through pagination
    if (searchQuery) {
      setIsSearchResults(true);
    }
  };

  const handleTypingChange = (typing: boolean) => {
    setIsTyping(typing);
  };

  const handleClose = () => {
    searchProducts('');
    setIsSearchResults(false);
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.container}>
        <TopNavigation 
          isSearchMode={isTyping || isSearchResults}
          isSearchResults={isSearchResults}
          onClose={handleClose}
          onBack={() => setIsTyping(false)}
        />
        <SearchBar 
          onSearch={handleSearch} 
          initialQuery={searchQuery} 
          popularSearches={POPULAR_SEARCHES}
          onTypingChange={handleTypingChange}
          isTypingExternal={isTyping}
          onDirectSearch={(query, products) => {
            searchProducts(query);
          }}
        />

        <div className={styles.content}>
          <main className={styles.main}>
            <BannerCarousel />
            <CategoryScroll />

            {!isSearchResults && (
              <>
                <ProductGrid products={products} loading={loading} />
                {pagination && (
                  <Pagination 
                    currentPage={pagination.current_page} 
                    totalPages={pagination.total_pages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            )}

            {isSearchResults && (
              <div className={`${styles.searchResultsOverlay} ${isSearchResults ? styles.visible : ''}`}>
                {searchQuery && !loading && (
                  <div className={styles.searchResultsCount}>
                    Найдено товаров: {products.length}
                  </div>
                )}
                <ProductGrid products={products} loading={loading} />

                {pagination && (
                  <Pagination 
                    currentPage={pagination.current_page} 
                    totalPages={pagination.total_pages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </div>
            )}

            <FooterInfo />
            <Navigation />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
