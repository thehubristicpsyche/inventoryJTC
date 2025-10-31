/**
 * Application Route Constants
 */

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_ADD: '/products/add',
  PRODUCT_EDIT: (id) => `/products/${id}/edit`,
  QUOTATIONS: '/quotations',
  QUOTATION_CREATE: '/quotations/create',
  QUOTATION_VIEW: (id) => `/quotations/${id}`,
  IMPORT: '/import',
  PROFILE: '/profile',
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PRODUCTS,
  ROUTES.QUOTATIONS,
  ROUTES.IMPORT,
  ROUTES.PROFILE,
];

