import { useState } from 'react';
import type { FC } from 'react';
import type { Category, ProductMark, Color } from '../../types/product';
import styles from './Filters.module.scss';

interface FiltersProps {
  categories: Category[];
  productMarks: ProductMark[];
  colors: Color[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categories: number[];
  marks: number[];
  colors: number[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

export const Filters: FC<FiltersProps> = ({ 
  categories, 
  productMarks, 
  colors,
  onFilterChange 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    marks: [],
    colors: [],
    priceRange: {
      min: null,
      max: null
    }
  });

  // Get unique colors from all products
  const uniqueColors = colors.filter((color, index, self) => 
    index === self.findIndex((c) => c.Color_ID === color.Color_ID)
  );

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setFilters(prev => {
      const newCategories = checked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId);

      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const handleMarkChange = (markId: number, checked: boolean) => {
    setFilters(prev => {
      const newMarks = checked 
        ? [...prev.marks, markId]
        : prev.marks.filter(id => id !== markId);

      return {
        ...prev,
        marks: newMarks
      };
    });
  };

  const handleColorChange = (colorId: number) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter(id => id !== colorId)
        : [...prev.colors, colorId];

      return {
        ...prev,
        colors: newColors
      };
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value);

    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: numValue
      }
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      marks: [],
      colors: [],
      priceRange: {
        min: null,
        max: null
      }
    });
    onFilterChange({
      categories: [],
      marks: [],
      colors: [],
      priceRange: {
        min: null,
        max: null
      }
    });
  };

  return (
    <div className={styles.filters}>
      <h2 className={styles.title}>Фильтры</h2>

      {/* Categories */}
      {categories.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Категории</h3>
          <div className={styles.checkboxGroup}>
            {categories.map(category => (
              <div key={category.Category_ID} className={styles.checkbox}>
                <input
                  type="checkbox"
                  id={`category-${category.Category_ID}`}
                  checked={filters.categories.includes(category.Category_ID)}
                  onChange={(e) => handleCategoryChange(category.Category_ID, e.target.checked)}
                />
                <label htmlFor={`category-${category.Category_ID}`}>
                  {category.Category_Name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Marks */}
      {productMarks.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Метки</h3>
          <div className={styles.checkboxGroup}>
            {productMarks.map(mark => (
              <div key={mark.Mark_ID} className={styles.checkbox}>
                <input
                  type="checkbox"
                  id={`mark-${mark.Mark_ID}`}
                  checked={filters.marks.includes(mark.Mark_ID)}
                  onChange={(e) => handleMarkChange(mark.Mark_ID, e.target.checked)}
                />
                <label htmlFor={`mark-${mark.Mark_ID}`}>
                  {mark.Mark_Name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {uniqueColors.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Цвета</h3>
          <div className={styles.colorFilters}>
            {uniqueColors.map(color => (
              <div
                key={color.Color_ID}
                className={`${styles.colorOption} ${filters.colors.includes(color.Color_ID) ? styles.selected : ''}`}
                style={{ backgroundColor: color.Color_Code }}
                onClick={() => handleColorChange(color.Color_ID)}
                title={color.Color_Name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Цена</h3>
        <div className={styles.priceRange}>
          <input
            type="number"
            placeholder="От"
            value={filters.priceRange.min === null ? '' : filters.priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="До"
            value={filters.priceRange.max === null ? '' : filters.priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <button className={styles.applyButton} onClick={handleApplyFilters}>
        Применить фильтры
      </button>
      <button className={styles.resetButton} onClick={handleResetFilters}>
        Сбросить фильтры
      </button>
    </div>
  );
};

export default Filters;
