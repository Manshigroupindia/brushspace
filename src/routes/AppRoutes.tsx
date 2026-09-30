import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { ShopPage } from '../pages/public/ShopPage';
import { CategoryPage } from '../pages/public/CategoryPage';
import { CategoriesPage } from '../pages/public/CategoriesPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { CartPage } from '../pages/public/CartPage';
import { WishlistPage } from '../pages/public/WishlistPage';
import { SearchPage } from '../pages/public/SearchPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { FAQPage } from '../pages/public/FAQPage';
import { PrivacyPolicyPage } from '../pages/public/PrivacyPolicyPage';
import { TermsPage } from '../pages/public/TermsPage';
import { ShippingPolicyPage } from '../pages/public/ShippingPolicyPage';
import { ReturnPolicyPage } from '../pages/public/ReturnPolicyPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminBannersPage } from '../pages/admin/AdminBannersPage';
import { AdminTestimonialsPage } from '../pages/admin/AdminTestimonialsPage';
import { AdminFAQsPage } from '../pages/admin/AdminFAQsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminPagesPage } from '../pages/admin/AdminPagesPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />
      </Route>

      {/* Admin Login (Standalone) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Panel (Protected) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="faqs" element={<AdminFAQsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="pages" element={<AdminPagesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Catch-all Not Found Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
