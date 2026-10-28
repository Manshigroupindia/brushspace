import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem } from '../types';
import { generateCartWhatsAppUrl, recordOrderInquiry } from '../utils/whatsapp';
import { useStoreData } from './StoreDataContext';
import { calculateCartTotals, calculateProductPrice } from '../utils/campaign';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  originalSubtotal: number;
  subtotal: number;
  totalSavings: number;
  totalAmount: number;
  buyNowWhatsApp: (sellerNumber?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'brushspace_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useStoreData();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Centralized calculations taking festive campaign into account
  const totals = calculateCartTotals(items, settings.festiveCampaign);
  const totalItems = totals.totalItemsCount;
  const originalSubtotal = totals.originalSubtotal;
  const subtotal = totals.subtotal;
  const totalSavings = totals.totalSavings;
  const totalAmount = subtotal; // Shipping is payable by customer and confirmed separately

  const buyNowWhatsApp = (sellerNumber?: string) => {
    if (items.length === 0) return;

    recordOrderInquiry(
      items.map((i) => {
        const priceInfo = calculateProductPrice(i.product, settings.festiveCampaign);
        return {
          productName: i.product.name,
          productCode: i.product.productCode,
          price: priceInfo.discountedPrice,
          quantity: i.quantity,
        };
      }),
      totalAmount
    );

    const url = generateCartWhatsAppUrl(
      items,
      totalAmount,
      undefined,
      sellerNumber || settings.whatsappNumber,
      settings.festiveCampaign
    );
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        originalSubtotal,
        subtotal,
        totalSavings,
        totalAmount,
        buyNowWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
