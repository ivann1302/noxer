// Custom hook for managing product data and search functionality

import { useState, useEffect, useCallback } from 'react';
import type { Product, Pagination } from '../types/product';
import { fetchMainProducts, fetchProducts } from '../services/api';

interface UseProductsReturn {
  products: Product[];
  mainProducts: Product[];
  loading: boolean;
  error: Error | null;
  pagination: Pagination | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [mainProducts, setMainProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch main products on initial load
  useEffect(() => {
    const loadMainProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchMainProducts();
        setMainProducts(data.products);
        setError(null);
      } catch (err) {
        console.error('Error in useProducts hook:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Note: fetchMainProducts now returns mock data on error, so this catch block should rarely execute
      } finally {
        setLoading(false);
      }
    };

    loadMainProducts();
  }, []);

  // Fetch products with pagination
  const fetchProductsWithPagination = useCallback(async (page: number = 1, query: string = '') => {
    try {
      setLoading(true);
      const data = await fetchProducts(page, 20, query);
      setProducts(data.products);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error in fetchProductsWithPagination:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Note: fetchProducts now returns mock data on error, so this catch block should rarely execute
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (pagination && pagination.has_next) {
      await fetchProductsWithPagination(pagination.current_page + 1, searchQuery);
    }
  }, [pagination, searchQuery, fetchProductsWithPagination]);

  // Fetch previous page
  const fetchPreviousPage = useCallback(async () => {
    if (pagination && pagination.has_prev) {
      await fetchProductsWithPagination(pagination.current_page - 1, searchQuery);
    }
  }, [pagination, searchQuery, fetchProductsWithPagination]);

  // Fetch specific page
  const fetchPage = useCallback(async (page: number) => {
    await fetchProductsWithPagination(page, searchQuery);
  }, [searchQuery, fetchProductsWithPagination]);

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    setSearchQuery(query);
    await fetchProductsWithPagination(1, query);
  }, [fetchProductsWithPagination]);

  // Load initial products
  useEffect(() => {
    fetchProductsWithPagination(1);
  }, [fetchProductsWithPagination]);

  return {
    products,
    mainProducts,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchNextPage,
    fetchPreviousPage,
    fetchPage,
    searchProducts,
  };
};
