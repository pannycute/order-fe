// Global type definitions

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  product_id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  duration: number; // in months
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  status: 'pending' | 'proses' | 'selesai' | 'cancelled';
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  payment_method_id: number;
  method_name: string;
  details: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentConfirmation {
  confirmation_id: number;
  order_id: number;
  user_id: number;
  amount: number;
  bukti_transfer?: string;
  payment_method_id: number;
  confirmation_date: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at?: string;
  updated_at?: string;
  proof_image?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  totalData?: number;
  page?: number;
  limit?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ReportData {
  total: number;
  data?: any[];
}

export interface MonthlyReport {
  month: string;
  total: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  duration: number;
}

export interface OrderForm {
  user_id?: number;
  order_date: string;
  status: string;
  total_amount: number;
  items?: OrderItemForm[];
}

export interface OrderItemForm {
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface PaymentConfirmationForm {
  order_id: number;
  user_id: number;
  amount: number;
  bukti_transfer?: File;
  payment_method_id: number;
  confirmation_date: string;
  status: string;
  proof_image?: File;
}

// Store types
export interface BaseStore<T> {
  data: T[];
  currentItem: T | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;
  
  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (id: number) => Promise<void>;
  addOne: (payload: Partial<T>) => Promise<void>;
  updateOne: (id: number, payload: Partial<T>) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
}

// Component props
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface TableColumn<T = any> {
  name: string;
  uid: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface PaginationProps {
  page: number;
  limit: number;
  totalData: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

// Notification types
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Theme types
export interface ThemeConfig {
  isDark: boolean;
  toggleTheme: () => void;
}

// API Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
} 