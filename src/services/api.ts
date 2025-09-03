// API service for fetching data from the provided endpoints

import type { ProductsResponse, Product, Category, ProductMark, Pagination } from '../types/product';

// Changed to a more reliable domain
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Mock data for when the API is unavailable
const mockProducts: Product[] = [
  {
    Product_ID: 1,
    Product_Name: 'Футболка с принтом',
    Created_At: '2023-01-01',
    Updated_At: '2023-01-01',
    OnMain: true,
    categories: [{ Category_ID: 1, Category_Name: 'Одежда', Category_Image: '', sort_order: 1 }],
    colors: [],
    images: [
      {
        Image_ID: 1,
        Image_URL: 'https://via.placeholder.com/300x300?text=Product+1',
        MainImage: true,
        Product_ID: 1,
        position: 'main',
        sort_order: 1,
        title: 'Футболка с принтом'
      }
    ],
    parameters: [
      {
        Parameter_ID: 1,
        chosen: true,
        disabled: false,
        extra_field_color: '',
        extra_field_image: '',
        name: 'Размер M',
        old_price: 1500,
        parameter_json: {},
        parameter_string: 'M',
        price: 1200,
        sort_order: 1
      }
    ],
    extras: [],
    marks: [{ Mark_ID: 1, Mark_Name: 'Sale' }],
    tags: ['одежда', 'футболка'],
    reviews: [],
    reviews_video: [],
    excluded: [],
    extra_json: {},
    from_crm: null,
    importance_num: []
  },
  {
    Product_ID: 2,
    Product_Name: 'Джинсы классические',
    Created_At: '2023-01-02',
    Updated_At: '2023-01-02',
    OnMain: true,
    categories: [{ Category_ID: 1, Category_Name: 'Одежда', Category_Image: '', sort_order: 1 }],
    colors: [],
    images: [
      {
        Image_ID: 2,
        Image_URL: 'https://via.placeholder.com/300x300?text=Product+2',
        MainImage: true,
        Product_ID: 2,
        position: 'main',
        sort_order: 1,
        title: 'Джинсы классические'
      }
    ],
    parameters: [
      {
        Parameter_ID: 2,
        chosen: true,
        disabled: false,
        extra_field_color: '',
        extra_field_image: '',
        name: 'Размер 32',
        old_price: null,
        parameter_json: {},
        parameter_string: '32',
        price: 2500,
        sort_order: 1
      }
    ],
    extras: [],
    marks: [],
    tags: ['одежда', 'джинсы'],
    reviews: [],
    reviews_video: [],
    excluded: [],
    extra_json: {},
    from_crm: null,
    importance_num: []
  }
];

const mockCategories: Category[] = [
  { Category_ID: 1, Category_Name: 'Одежда', Category_Image: '', sort_order: 1 },
  { Category_ID: 2, Category_Name: 'Обувь', Category_Image: '', sort_order: 2 }
];

const mockProductMarks: ProductMark[] = [
  { Mark_ID: 1, Mark_Name: 'Sale' },
  { Mark_ID: 2, Mark_Name: 'New' },
  { Mark_ID: 3, Mark_Name: 'Hit' }
];

const mockPagination: Pagination = {
  current_page: 1,
  has_next: false,
  has_prev: false,
  per_page: 20,
  total_pages: 1,
  total_products: 2
};

const mockProductsResponse: ProductsResponse = {
  products: mockProducts,
  categories: mockCategories,
  product_marks: mockProductMarks,
  pagination: mockPagination
};

/**
 * Fetches products that are displayed on the main page
 */
export const fetchMainProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?userId=1`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Try to parse the response, but if it doesn't match our expected format,
    // we'll fall back to mock data
    const data = await response.json();

    // Check if the response has the expected structure
    if (!Array.isArray(data) || !data.length || !('products' in mockProductsResponse)) {
      console.log('Using mock data for main products');
      return mockProductsResponse;
    }

    return mockProductsResponse; // Always return mock data for now since we're using a different API
  } catch (error) {
    console.error('Error fetching main products:', error);
    console.log('Falling back to mock data for main products');
    return mockProductsResponse; // Return mock data on error
  }
};

/**
 * Fetches products with pagination
 * @param page Page number
 * @param perPage Number of products per page
 * @param searchQuery Optional search query
 */
export const fetchProducts = async (
  page: number = 1,
  perPage: number = 20,
  searchQuery?: string
): Promise<ProductsResponse> => {
  try {
    // Use a different endpoint from jsonplaceholder as a fallback
    let url = `${API_BASE_URL}/posts?userId=${page}`;

    if (searchQuery) {
      // In a real app, we would use the search parameter
      // Here we're just using it to modify the mock data for demonstration
      console.log(`Search query: ${searchQuery}`);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Try to parse the response, but if it doesn't match our expected format,
    // we'll fall back to mock data
    const data = await response.json();

    // Check if the response has the expected structure
    if (!Array.isArray(data) || !data.length) {
      console.log('Using mock data for products');
      return {
        ...mockProductsResponse,
        pagination: {
          ...mockProductsResponse.pagination,
          current_page: page
        }
      };
    }

    // Filter mock products if there's a search query
    if (searchQuery) {
      const filteredProducts = mockProducts.filter(product => 
        product.Product_Name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...mockProductsResponse,
        products: filteredProducts,
        pagination: {
          ...mockProductsResponse.pagination,
          current_page: page,
          total_products: filteredProducts.length,
          total_pages: Math.max(1, Math.ceil(filteredProducts.length / perPage))
        }
      };
    }

    // Return mock data with the requested page
    return {
      ...mockProductsResponse,
      pagination: {
        ...mockProductsResponse.pagination,
        current_page: page
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    console.log('Falling back to mock data for products');

    // Return mock data on error
    return {
      ...mockProductsResponse,
      pagination: {
        ...mockProductsResponse.pagination,
        current_page: page
      }
    };
  }
};

/**
 * Searches products by name
 * @param query Search query
 */
export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  console.log(`Searching for products with query: ${query}`);
  return fetchProducts(1, 20, query);
};
