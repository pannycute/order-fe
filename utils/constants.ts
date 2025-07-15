// Application constants

import { API_URL } from "./axiosInstance";

export const APP_NAME = 'Sistem Order Management';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = API_URL
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROSES: 'proses',
  SELESAI: 'selesai',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROSES]: 'Proses',
  [ORDER_STATUS.SELESAI]: 'Selesai',
  [ORDER_STATUS.CANCELLED]: 'Dibatalkan',
} as const;

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PROSES]: 'primary',
  [ORDER_STATUS.SELESAI]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.CONFIRMED]: 'Dikonfirmasi',
  [PAYMENT_STATUS.REJECTED]: 'Ditolak',
} as const;

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.CONFIRMED]: 'success',
  [PAYMENT_STATUS.REJECTED]: 'danger',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.USER]: 'User',
} as const;

// Table Columns
export const PRODUCT_COLUMNS = [
  { name: 'ID', uid: 'product_id', sortable: true },
  { name: 'Nama Produk', uid: 'name', sortable: true },
  { name: 'Deskripsi', uid: 'description' },
  { name: 'Harga', uid: 'price', sortable: true },
  { name: 'Stock', uid: 'stock', sortable: true },
  { name: 'Durasi (Bulan)', uid: 'duration', sortable: true },
  { name: 'Aksi', uid: 'actions' },
];

export const ORDER_COLUMNS = [
  { name: 'ID', uid: 'order_id', sortable: true },
  { name: 'User', uid: 'user_name', sortable: true },
  { name: 'Tanggal Order', uid: 'order_date', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Total Amount', uid: 'total_amount', sortable: true },
  { name: 'Aksi', uid: 'actions' },
];

export const USER_ORDER_COLUMNS = [
  { name: 'ID', uid: 'order_id', sortable: true },
  { name: 'Tanggal Order', uid: 'order_date', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Total Amount', uid: 'total_amount', sortable: true },
  { name: 'Tenggat Waktu', uid: 'deadline' },
  { name: 'Aksi', uid: 'actions' },
];

export const PAYMENT_CONFIRMATION_COLUMNS = [
  { name: 'ID', uid: 'confirmation_id', sortable: true },
  { name: 'Order ID', uid: 'order_id', sortable: true },
  { name: 'User', uid: 'user_name', sortable: true },
  { name: 'Amount', uid: 'amount', sortable: true },
  { name: 'Payment Method', uid: 'payment_method_name', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Tanggal Konfirmasi', uid: 'confirmation_date', sortable: true },
  { name: 'Aksi', uid: 'actions' },
];

export const USER_COLUMNS = [
  { name: 'ID', uid: 'user_id', sortable: true },
  { name: 'Nama', uid: 'name', sortable: true },
  { name: 'Email', uid: 'email', sortable: true },
  { name: 'Role', uid: 'role', sortable: true },
  { name: 'Aksi', uid: 'actions' },
];

// Navigation
export const ADMIN_MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'home',
  },
  {
    name: 'Users',
    href: '/accounts',
    icon: 'users',
  },
  {
    name: 'Products',
    href: '/products',
    icon: 'products',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: 'payments',
  },
  {
    name: 'Order Items',
    href: '/order_items',
    icon: 'reports',
  },
  {
    name: 'Payment Methods',
    href: '/paymentmethod',
    icon: 'balance',
  },
  {
    name: 'Payment Confirmations',
    href: '/payment_confirmations',
    icon: 'reports',
  },
];

export const USER_MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: '/user-dashboard',
    icon: 'home',
  },
  {
    name: 'Products',
    href: '/user-products',
    icon: 'products',
  },
  {
    name: 'My Orders',
    href: '/user-orders',
    icon: 'payments',
  },
];

// Chart Colors
export const CHART_COLORS = {
  primary: '#0070F0',
  secondary: '#7928CA',
  success: '#17C964',
  warning: '#F5A524',
  danger: '#F31260',
  default: '#889096',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMMM yyyy',
  DISPLAY_TIME: 'dd MMMM yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  UNAUTHORIZED: 'Anda tidak memiliki akses ke halaman ini.',
  FORBIDDEN: 'Akses ditolak.',
  NOT_FOUND: 'Data tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Data berhasil dibuat.',
  UPDATED: 'Data berhasil diperbarui.',
  DELETED: 'Data berhasil dihapus.',
  LOGIN: 'Login berhasil.',
  LOGOUT: 'Logout berhasil.',
  REGISTER: 'Registrasi berhasil.',
  UPLOAD: 'File berhasil diupload.',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  PRICE_MIN: 0,
  STOCK_MIN: 0,
  DURATION_MIN: 1,
} as const; 