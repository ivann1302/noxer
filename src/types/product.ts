// Product-related types based on the API response

export interface Category {
  Category_ID: number;
  Category_Name: string;
  Category_Image: string;
  sort_order: number;
}

export interface Color {
  Color_ID: number;
  Color_Name: string;
  Color_Code: string;
  Color_image: string;
  Product_ID: number;
  discount: number;
  json_data: {
    add_images: string[];
  };
  sort_order: number;
}

export interface ProductMark {
  Mark_ID: number;
  Mark_Name: string;
}

export interface ProductImage {
  Image_ID: number;
  Image_URL: string;
  MainImage: boolean;
  Product_ID: number;
  position: string;
  sort_order: number;
  title: string;
}

export interface ProductParameter {
  Parameter_ID: number;
  chosen: boolean;
  disabled: boolean;
  extra_field_color: string;
  extra_field_image: string;
  name: string;
  old_price: number | null;
  parameter_json: any;
  parameter_string: string;
  price: number;
  sort_order: number | null;
}

export interface ProductExtra {
  Product_Extra_ID: number;
  Product_ID: number;
  Characteristics: string;
  Kit: string;
  Delivery: string;
  Offer: string;
  ai_description: string;
}

export interface ProductReview {
  Photo_ID: number;
  Photo_URL: string;
  Product_ID: number;
  sort_order: number | null;
}

export interface ProductVideoReview {
  Video_ID: number;
  Video_URL: string;
  Poster_URL: string;
  Product_ID: number;
  sort_order: number | null;
}

export interface Product {
  Product_ID: number;
  Product_Name: string;
  Created_At: string;
  Updated_At: string;
  OnMain: boolean;
  categories: Category[];
  colors: Color[];
  images: ProductImage[];
  parameters: ProductParameter[];
  extras: ProductExtra[];
  marks: ProductMark[];
  tags: string[];
  reviews: ProductReview[];
  reviews_video: ProductVideoReview[];
  excluded: any[];
  extra_json: Record<string, any>;
  from_crm: any;
  importance_num: Array<{
    id: number;
    importance: number;
    product_id: number;
  }>;
}

export interface Pagination {
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
  per_page: number;
  total_pages: number;
  total_products: number;
}

export interface ProductsResponse {
  products: Product[];
  categories: Category[];
  product_marks: ProductMark[];
  pagination: Pagination;
}