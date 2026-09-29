import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem } from '../types';
import { generateCartWhatsAppUrl, recordOrderInquiry } from '../utils/whatsapp';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  isFreeShippingUnlocked: boolean;
  buyNowWhatsApp: (sellerNumber?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'brushspace_cart';
const FREE_SHIPPING_THRESHOLD = 5000;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = subtotal === 0 || isFreeShippingUnlocked ? 0 : 350;
  const totalAmount = subtotal + shippingFee;

  const buyNowWhatsApp = (sellerNumber?: string) => {
    if (items.length === 0) return;
    recordOrderInquiry(
      items.map((i) => ({
        productName: i.product.name,
        productCode: i.product.productCode,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalAmount
    );
    const url = generateCartWhatsAppUrl(items, totalAmount, undefined, sellerNumber);
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
        subtotal,
        shippingFee,
        totalAmount,
        isFreeShippingUnlocked,
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
