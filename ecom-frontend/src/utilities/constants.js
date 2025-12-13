/**
 * constants.js
 * Application-wide constants to avoid magic numbers and strings.
 * Centralized location for all configuration values.
 */

// ============================================
// APPLICATION INFO
// ============================================
export const APP_NAME = 'York-Store';
export const APP_TAGLINE = 'Buy All Your YorkU Essentials Here!';

// ============================================
// PAGINATION
// ============================================
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;
export const CUSTOMERS_PER_PAGE = 10;
export const CATEGORIES_PER_PAGE = 10;

// ============================================
// CART & CHECKOUT
// ============================================
export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 5.99;
export const TAX_RATE = 0.08; // 8% tax

// ============================================
// STOCK LEVELS
// ============================================
export const LOW_STOCK_THRESHOLD = 10;
export const OUT_OF_STOCK = 0;

// ============================================
// NOTIFICATIONS
// ============================================
export const SUCCESS_TOAST_DURATION = 3000; // 3 seconds
export const ERROR_TOAST_DURATION = 5000; // 5 seconds
export const INFO_TOAST_DURATION = 4000; // 4 seconds

// ============================================
// VALIDATION
// ============================================
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

// Card validation
export const MIN_CARD_NUMBER_LENGTH = 13;
export const MAX_CARD_NUMBER_LENGTH = 19;
export const CVV_LENGTH_MIN = 3;
export const CVV_LENGTH_MAX = 4;

// ============================================
// PAYMENT METHODS
// ============================================
export const PAYMENT_METHOD_SAVED_CARD = 'SAVED_CARD';
export const PAYMENT_METHOD_NEW_CARD = 'NEW_CARD';
export const PAYMENT_METHOD_COD = 'COD';

// ============================================
// ORDER STATUSES
// ============================================
export const ORDER_STATUS_PENDING = 'Pending';
export const ORDER_STATUS_ACCEPTED = 'Order Accepted !';
export const ORDER_STATUS_SHIPPED = 'Shipped';
export const ORDER_STATUS_DELIVERED = 'Delivered';
export const ORDER_STATUS_CANCELLED = 'Cancelled';

// ============================================
// USER ROLES
// ============================================
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_USER = 'ROLE_USER';

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const LS_AUTH_KEY = 'auth';
export const LS_CART_ITEMS_KEY = 'cartItems';
export const LS_CHECKOUT_ADDRESS_KEY = 'CHECKOUT_ADDRESS';
export const LS_CHECKOUT_PAYMENT_CARD_KEY = 'CHECKOUT_PAYMENT_CARD';

// ============================================
// API ENDPOINTS (if needed)
// ============================================
export const API_BASE_URL = import.meta.env.VITE_BACK_END_URL || 'http://localhost:8080';

// ============================================
// CAROUSEL SETTINGS
// ============================================
export const CAROUSEL_AUTOPLAY_SPEED = 3000; // 4 seconds
export const CAROUSEL_TRANSITION_SPEED = 600; // 0.6 seconds

// ============================================
// DEBOUNCE DELAYS
// ============================================
export const SEARCH_DEBOUNCE_DELAY = 700; // 0.7 seconds for search input
