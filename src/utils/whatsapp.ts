import type { Product, CartItem, FestiveCampaignConfig } from '../types';
import { saveOrderDoc } from '../services/firestore';
import { calculateProductPrice } from './campaign';

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
  sellerNumber?: string,
  campaign?: FestiveCampaignConfig
): string {
  const number = sellerNumber || getActiveWhatsAppNumber();
  const productUrl = customUrl || (typeof window !== 'undefined' ? window.location.href : `https://www.brushspace.in/product/${product.slug}`);

  const priceInfo = calculateProductPrice(product, campaign);
  const effectivePrice = priceInfo.discountedPrice;
  const subtotal = effectivePrice * quantity;

  const message = `Hello, I am interested in placing an order.

Products:
${product.name} — ${product.productCode}
Price: ${formatINR(effectivePrice)}
Quantity: ${quantity}
Subtotal: ${formatINR(subtotal)}

Shipping: Payable by customer; final charges to be confirmed separately.
Return Policy: No return, no refund and no exchange, subject to applicable law.
Product Link: ${productUrl}

Please confirm the shipping charges, availability and next steps for placing my order.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL for Cart containing multiple products
 */
export function generateCartWhatsAppUrl(
  cartItems: CartItem[],
  totalAmountOverride?: number,
  customCartUrl?: string,
  sellerNumber?: string,
  campaign?: FestiveCampaignConfig
): string {
  const number = sellerNumber || getActiveWhatsAppNumber();
  const cartUrl = customCartUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.brushspace.in/cart');

  let computedSubtotal = 0;
  const itemsList = cartItems
    .map((item, idx) => {
      const priceInfo = calculateProductPrice(item.product, campaign);
      const effectivePrice = priceInfo.discountedPrice;
      const itemSubtotal = effectivePrice * item.quantity;
      computedSubtotal += itemSubtotal;
      return `${idx + 1}. ${item.product.name} — ${item.product.productCode}\n   Price: ${formatINR(effectivePrice)}\n   Quantity: ${item.quantity}\n   Subtotal: ${formatINR(itemSubtotal)}`;
    })
    .join('\n\n');

  const finalSubtotal = totalAmountOverride !== undefined ? totalAmountOverride : computedSubtotal;

  const message = `Hello, I am interested in placing an order.

Products:
${itemsList}

Subtotal: ${formatINR(finalSubtotal)}
Shipping: Payable by customer; final charges to be confirmed separately.
Return Policy: No return, no refund and no exchange, subject to applicable law.
Cart Link: ${cartUrl}

Please confirm the shipping charges, availability and next steps for placing my order.`;

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
