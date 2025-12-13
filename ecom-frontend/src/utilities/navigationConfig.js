/**
 * navigationConfig.js
 * Navigation menu configuration for admin dashboard.
 * Extracted from utils/index.js for better organization.
 */

import { FaBoxOpen, FaHome, FaShoppingCart, FaThList, FaUsers } from 'react-icons/fa';

export const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: FaHome,
    current: true,
  },
  {
    name: 'Sales History',
    href: '/admin/orders',
    icon: FaShoppingCart,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: FaBoxOpen,
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FaThList,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: FaUsers,
  },
];
