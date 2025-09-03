import { useState, useEffect, useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import styles from './SearchBar.module.scss';
import searchIcon from '../../assets/icons/searchIcon.svg';
import { searchProducts, fetchProducts } from '../../services/api';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  popularSearches?: string[];
  onTypingChange?: (isTyping: boolean) => void;
  isTypingExternal?: boolean;
  onDirectSearch?: (query: string, products: Product[]) => void;
}

// Predefined categories for search suggestions
const SEARCH_SUGGESTIONS = [
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

export const SearchBar: FC<SearchBarProps> = ({ 
  onSearch, 
  initialQuery = '', 
  popularSearches = [],
  onTypingChange,
  isTypingExternal,
  onDirectSearch
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGoButton, setShowGoButton] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Update internal isTyping state when isTypingExternal changes
  useEffect(() => {
    if (isTypingExternal !== undefined) {
      setIsTyping(isTypingExternal);
      // If isTypingExternal is false, also clear the search query
      if (!isTypingExternal) {
        setSearchQuery('');
        setSearchResults([]);
        setShowGoButton(false);
      }
    }
  }, [isTypingExternal]);

  // Notify parent component when isTyping changes
  useEffect(() => {
    if (onTypingChange) {
      onTypingChange(isTyping);
    }
  }, [isTyping, onTypingChange]);


  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setShowGoButton(false);
        return;
      }

      try {
        setLoading(true);
        const response = await searchProducts(query);
        // Filter products to only include those whose names contain the search query
        const filteredProducts = response.products.filter(product => 
          product.Product_Name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProducts);
        setShowGoButton(filteredProducts.length > 0);

        // Don't call onSearch here to prevent constant re-rendering
        // This will be handled by the handleSubmit, handleSearchIconClick, and handleSuggestionClick functions
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setShowGoButton(false);
      } finally {
        setLoading(false);
      }
    },
    [onSearch]
  );

  // Call debouncedSearch when searchQuery changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        debouncedSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowGoButton(false);
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Call onSearch to update the UI state
      onSearch(searchQuery.trim());

      // Log for debugging
      console.log('Search submitted with query:', searchQuery.trim());

      // Ensure the search input has the correct value
      const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
      if (searchInput && searchInput.value !== searchQuery.trim()) {
        searchInput.value = searchQuery.trim();
      }

      setIsTyping(false);
    }
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setIsTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsTyping(value.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Set the search query
    setSearchQuery(suggestion);

    // Create a temporary input element for copying
    const tempInput = document.createElement('input');
    tempInput.value = suggestion;
    document.body.appendChild(tempInput);

    // Select the text and copy it
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text
    document.execCommand('copy');

    // Remove the temporary element
    document.body.removeChild(tempInput);

    console.log('Text copied to clipboard:', suggestion);

    // Update the search input with the suggestion
    const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;

      // Focus the input to ensure the UI updates properly
      searchInput.focus();

      // Trigger the input event to ensure any listeners are notified
      const inputEvent = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(inputEvent);
    }

    // Directly call onSearch to trigger the search
    console.log('Directly calling onSearch with query:', suggestion);
    onSearch(suggestion);

    // If onDirectSearch is provided, call it as well
    if (onDirectSearch) {
      console.log('Also calling onDirectSearch with query:', suggestion);
      // Fetch products for this query and pass them to onDirectSearch
      searchProducts(suggestion)
        .then(response => {
          if (response && response.products) {
            onDirectSearch(suggestion, response.products);
          }
        })
        .catch(error => {
          console.error('Error fetching products for direct search:', error);
          onDirectSearch(suggestion, []);
        });
    }

    // Set isTyping to false directly without triggering form submission
    // This will hide the search suggestions and update the UI
    setIsTyping(false);
  };

  const handleGoButtonClick = () => {
    if (searchQuery.trim()) {
      // Call onSearch to update the UI state
      onSearch(searchQuery.trim());

      // Log for debugging
      console.log('Go button clicked with query:', searchQuery.trim());

      // Ensure the search input has the correct value
      const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
      if (searchInput && searchInput.value !== searchQuery.trim()) {
        searchInput.value = searchQuery.trim();
      }

      // Set isTyping to false directly without triggering form submission
      setIsTyping(false);
    }
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      // Call onSearch to update the UI state
      onSearch(searchQuery.trim());

      // Log for debugging
      console.log('Search icon clicked with query:', searchQuery.trim());

      // Ensure the search input has the correct value
      const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
      if (searchInput && searchInput.value !== searchQuery.trim()) {
        searchInput.value = searchQuery.trim();
      }

      // Set isTyping to false directly without triggering form submission
      setIsTyping(false);
    }
  };

  // Create a simplified version of the ProductCard component for search results
  const SearchResultCard = ({ product }: { product: Product }) => {
    // Find the main image
    const mainImage = product.images.find(img => img.MainImage) || product.images[0];

    // Get the price from parameters
    const getPrice = (): { price: number; oldPrice: number | null } => {
      const parameter = product.parameters.find((param) => param.chosen);

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

    const discountPercentage = getDiscountPercentage();

    return (
      <div className={styles.searchResultCard}>
        <div className={styles.searchResultImageContainer}>
          {mainImage && (
            <img 
              src={mainImage.Image_URL} 
              alt={product.Product_Name} 
              className={styles.searchResultImage}
            />
          )}
        </div>
        <div className={styles.searchResultContent}>
          <h3 className={styles.searchResultName}>{product.Product_Name}</h3>
          <div className={styles.searchResultPrice}>
            <span className={styles.searchResultCurrentPrice}>{formatPrice(price)}</span>
            {oldPrice && (
              <>
                <span className={styles.searchResultOldPrice}>{formatPrice(oldPrice)}</span>
                <span className={styles.searchResultDiscountPercentage}>-{discountPercentage || 0}%</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.searchBar}>
      <div className={`${styles.searchContainer} ${isTyping && searchResults.length > 0 ? styles.expanded : ''}`}>
        <form 
          className={styles.searchForm}
          onSubmit={handleSubmit}
        >
          <img 
            src={searchIcon} 
            alt="Search" 
            className={styles.searchIcon} 
            onClick={handleSearchIconClick}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Найти товары"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {showGoButton && (
            <button 
              type="button" 
              className={styles.goButton}
              onClick={handleGoButtonClick}
            >
              перейти
            </button>
          )}
        </form>

        {isTyping && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((product) => (
              <div key={product.Product_ID} className={styles.searchResultItem}>
                <SearchResultCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show popular searches only when input is focused and no text is entered */}
      {isFocused && searchQuery.length === 0 && (
        <div className={styles.searchSuggestions}>
          <h3 className={styles.suggestionsTitle}>Часто ищут</h3>
          <div className={styles.suggestionsList}>
            {popularSearches.length > 0 ? (
              popularSearches.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <img 
                    src={searchIcon} 
                    alt="Search" 
                    className={styles.suggestionIcon} 
                  />
                  <span className={styles.suggestionText}>{suggestion}</span>
                </div>
              ))
            ) : (
              SEARCH_SUGGESTIONS.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <img 
                    src={searchIcon} 
                    alt="Search" 
                    className={styles.suggestionIcon} 
                  />
                  <span className={styles.suggestionText}>{suggestion}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
