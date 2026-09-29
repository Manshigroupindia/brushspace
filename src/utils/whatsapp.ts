import type { Product, CartItem } from '../types';
import { saveOrderDoc } from '../services/firestore';

/**
 * Centralized configurable seller WhatsApp phone number
 * (without + or spaces, standard international format, e.g. 919876543210)
 */
export const DEFAULT_WHATSAPP_NUMBER = '919876543210';

export function getActiveWhatsAppNumber(): string {
  try {
    const saved = localStorage.getItem('brushspace_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.whatsappNumber && parsed.whatsappNumber.trim()) {
        return parsed.whatsappNumber.replace(/[^0-9]/g, '');
      }
    }
  } catch (err) {
    console.error('Error reading whatsapp number from settings', err);
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Generate WhatsApp URL for a single product order inquiry
 */
export function generateSingleProductWhatsAppUrl(
  product: Product,
  quantity: number = 1,
  customUrl?: string,
  sellerNumber?: string
): string {
  const number = sellerNumber || getActiveWhatsAppNumber();
  const productUrl = customUrl || (typeof window !== 'undefined' ? window.location.href : `https://brushspace.com/product/${product.slug}`);
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const message = `Hello, I am interested in ordering this product.

Product: ${product.name}
Product Code: ${product.productCode}
Price: ${formatINR(product.price)}
Quantity: ${quantity}
Date: ${today}

Product Link: ${productUrl}

Please share the next steps for placing the order.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL for Cart containing multiple products
 */
export function generateCartWhatsAppUrl(
  cartItems: CartItem[],
  totalAmount: number,
  customCartUrl?: string,
  sellerNumber?: string
): string {
  const number = sellerNumber || getActiveWhatsAppNumber();
  const cartUrl = customCartUrl || (typeof window !== 'undefined' ? window.location.href : 'https://brushspace.com/cart');

  const itemsList = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}\n   Product Code: ${item.product.productCode}\n   Price: ${formatINR(item.product.price)}\n   Quantity: ${item.quantity}`
    )
    .join('\n\n');

  const message = `Hello, I am interested in ordering the following products.

${itemsList}

Total: ${formatINR(totalAmount)}

Cart Link: ${cartUrl}

Please share the next steps for placing the order.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Record order enquiry to local store for admin tracking
 */
export function recordOrderInquiry(
  items: { productName: string; productCode: string; price: number; quantity: number }[],
  totalAmount: number
) {
  try {
    const existing = localStorage.getItem('brushspace_order_inquiries');
    const orders = existing ? JSON.parse(existing) : [];
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      items,
      totalAmount,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    localStorage.setItem('brushspace_order_inquiries', JSON.stringify(orders));

    // Also persist inquiry to Cloud Firestore
    saveOrderDoc({
      items,
      totalAmount,
      status: 'new',
    }).catch((err) => {
      console.warn('Firestore order log notice:', err.message);
    });

    // Also increment metrics
    const metricsKey = 'brushspace_admin_metrics';
    const metricsRaw = localStorage.getItem(metricsKey);
    const metrics = metricsRaw ? JSON.parse(metricsRaw) : { buyNowClicks: 0, wishlistAdditions: 0 };
    metrics.buyNowClicks = (metrics.buyNowClicks || 0) + 1;
    localStorage.setItem(metricsKey, JSON.stringify(metrics));
  } catch (err) {
    console.error('Failed to record order inquiry', err);
  }
}
