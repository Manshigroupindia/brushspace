import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'brushspace_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage', err);
    }
  }, [wishlistIds]);

  const addToWishlist = (product: Product) => {
    if (!wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => [...prev, product.id]);
      
      // Update admin metrics
      try {
        const metricsRaw = localStorage.getItem('brushspace_admin_metrics');
        const metrics = metricsRaw ? JSON.parse(metricsRaw) : { buyNowClicks: 0, wishlistAdditions: 0 };
        metrics.wishlistAdditions = (metrics.wishlistAdditions || 0) + 1;
        localStorage.setItem('brushspace_admin_metrics', JSON.stringify(metrics));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = (product: Product): boolean => {
    if (wishlistIds.includes(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlistItems: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
