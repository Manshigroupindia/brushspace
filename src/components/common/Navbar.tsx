import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
  ];

  return (
    <div className="w-full bg-surface/95 backdrop-blur-md">
      <div className="h-[58px] md:h-[68px] max-w-7xl mx-auto px-3.5 sm:px-6 md:px-gutter-desktop flex items-center justify-between">
        {/* LEFT: Brand Logo & Tagline */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* CENTER: Desktop Navigation Links (hidden on mobile) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-8 shrink-0"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'font-label-md text-label-md uppercase tracking-widest py-2 text-primary font-semibold underline decoration-primary underline-offset-8 transition-colors'
                  : 'font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors py-2'
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: Action Icons (Search, Wishlist, Cart) */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSearch) {
                onOpenSearch();
              } else {
                navigate('/search');
              }
            }}
            aria-label="Search collections"
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Link with Dynamic Badge */}
          <NavLink
            to="/wishlist"
            aria-label="Wishlist"
            className="relative w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {totalWishlistItems > 0 && (
              <span className="absolute top-1 right-1 bg-tertiary text-on-tertiary text-[10px] font-semibold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                {totalWishlistItems}
              </span>
            )}
          </NavLink>

          {/* Cart Link with Dynamic Badge */}
          <NavLink
            to="/cart"
            aria-label="Shopping Cart"
            className="relative w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-semibold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                {totalItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
};
