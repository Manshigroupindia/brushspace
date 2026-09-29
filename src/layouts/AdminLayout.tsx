import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant font-medium">
          Verifying Studio Authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
    { name: 'Products', path: '/admin/products', icon: 'inventory_2' },
    { name: 'Categories', path: '/admin/categories', icon: 'category' },
    { name: 'Banners', path: '/admin/banners', icon: 'view_carousel' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: 'reviews' },
    { name: 'FAQs', path: '/admin/faqs', icon: 'quiz' },
    { name: 'Orders / Enquiries', path: '/admin/orders', icon: 'receipt_long' },
    { name: 'Customers', path: '/admin/customers', icon: 'group' },
    { name: 'Pages', path: '/admin/pages', icon: 'article' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-container flex flex-col md:flex-row text-on-surface">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface border-b border-outline-variant/20 p-4 flex items-center justify-between sticky top-0 z-40">
        <Logo showText={true} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[24px]">
            {sidebarOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/20 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-semibold tracking-wider text-on-surface">
                BRUSHSPACE
              </span>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                Studio Atelier Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-label-md text-label-md uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-on-secondary-fixed text-surface font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-outline-variant/15 bg-surface-container-low">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body-sm text-body-sm font-semibold truncate text-on-surface">
                {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Studio Curator')}
              </p>
              <p className="font-label-sm text-label-sm text-outline truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error transition-colors font-label-sm text-label-sm uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <header className="hidden md:flex h-16 bg-surface border-b border-outline-variant/15 px-8 items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Live Atelier Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              <span>View Live Storefront</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
