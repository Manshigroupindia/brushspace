import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: 'home',
      end: true,
    },
    {
      name: 'Shop',
      path: '/shop',
      icon: 'storefront',
      end: true,
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: 'category',
      end: false,
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: 'favorite',
      badge: totalWishlistItems,
      badgeColor: 'bg-tertiary text-on-tertiary',
      end: true,
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: 'shopping_bag',
      badge: totalItems,
      badgeColor: 'bg-primary text-on-primary',
      end: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant/25 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] transition-all"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="h-16 w-full flex items-center justify-around px-1 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors select-none group ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant/80 hover:text-on-surface font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon wrapper with relative positioning for badge */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-active:scale-95'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>

                  {/* Dynamic Badge for Wishlist & Cart */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 ${item.badgeColor} text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.name}
                </span>

                {/* Subtle active indicator dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-primary mt-0.5"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
