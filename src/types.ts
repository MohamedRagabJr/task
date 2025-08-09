// types/index.ts

// Base Product interface with strict typing
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images?: string[];
  quantity?: number; // For cart items
}

// Category interface
export interface Category {
  id: number;
  name: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
}

// Cart item extends Product with required quantity
export interface CartItem extends Product {
  quantity: number;
}

// Breadcrumb types
export interface BreadcrumbItem {
  label: string;
  link?: string;
}

// Store types for better Zustand integration
export interface CartState {
  cart: CartItem[];
  count: number;
  addCart: (product: Product) => void;
  removeCart: (id: number) => void;
  deleteCart: (id: number) => void;
  clearCart: () => void;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// Filter types for product filtering
export interface ProductFilters {
  category?: number | null;
  priceRange: [number, number];
  searchTerm: string;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onAddToCart: (product: Product) => void;
}

// Grid layout type
export type GridLayout = 2 | 3 | 4;

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

// Utility types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Form types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavItem[];
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Utility function types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;