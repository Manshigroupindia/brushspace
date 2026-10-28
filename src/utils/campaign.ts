import type { FestiveCampaignConfig, CartItem } from '../types';
import { formatINR } from './whatsapp';

export const DEFAULT_FESTIVE_CAMPAIGN: FestiveCampaignConfig = {
  isActive: true,
  campaignName: 'FESTIVE BONANZA',
  headline: 'FLAT 20% OFF ON EVERY PRODUCT',
  supportingLine: 'Celebrate the season with beautiful décor. Shop your favourites and enjoy 20% OFF!',
  ctaText: 'SHOP NOW — LIMITED-TIME FESTIVE OFFER',
  ctaLink: '/shop',
  discountPercentage: 20,
  floatingButtonText: '🎉 FESTIVE SALE — 20% OFF',
  bannerImage: 'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg',
};

/**
 * Checks if the festive campaign is currently active
 */
export function isCampaignActive(campaign?: FestiveCampaignConfig): boolean {
  const conf = campaign || DEFAULT_FESTIVE_CAMPAIGN;
  if (!conf.isActive) return false;

  const now = new Date();
  if (conf.startDate) {
    const start = new Date(conf.startDate);
    if (!isNaN(start.getTime()) && now < start) {
      return false;
    }
  }

  if (conf.endDate) {
    const end = new Date(conf.endDate);
    if (!isNaN(end.getTime()) && now > end) {
      return false;
    }
  }

  return true;
}

export interface PriceCalculation {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  savings: number;
  isDiscounted: boolean;
  formattedOriginal: string;
  formattedDiscounted: string;
  formattedSavings: string;
}

/**
 * Centralized price calculation utility.
 * Applies a 20% discount (or configured percentage) to the base product price during an active campaign.
 * Preserves the base product price in Firestore.
 * Prevents double-discounting by always calculating off the product's base price.
 */
export function calculateProductPrice(
  product: { price: number; compareAtPrice?: number | null },
  campaign?: FestiveCampaignConfig
): PriceCalculation {
  const originalPrice = Math.max(0, Number(product.price) || 0);
  const active = isCampaignActive(campaign);
  const conf = campaign || DEFAULT_FESTIVE_CAMPAIGN;
  const discountPct = active ? Math.max(0, Math.min(100, Number(conf.discountPercentage) || 0)) : 0;

  if (active && discountPct > 0 && originalPrice > 0) {
    // Round to 2 decimal places, or to integer if standard currency
    const discountFactor = (100 - discountPct) / 100;
    const rawDiscounted = originalPrice * discountFactor;
    // For INR whole rupees, round to nearest rupee if base price is integer
    const discountedPrice = Number.isInteger(originalPrice)
      ? Math.round(rawDiscounted)
      : Math.round(rawDiscounted * 100) / 100;

    const savings = Math.max(0, originalPrice - discountedPrice);

    return {
      originalPrice,
      discountedPrice,
      discountPercentage: discountPct,
      savings,
      isDiscounted: true,
      formattedOriginal: formatINR(originalPrice),
      formattedDiscounted: formatINR(discountedPrice),
      formattedSavings: formatINR(savings),
    };
  }

  return {
    originalPrice,
    discountedPrice: originalPrice,
    discountPercentage: 0,
    savings: 0,
    isDiscounted: false,
    formattedOriginal: formatINR(originalPrice),
    formattedDiscounted: formatINR(originalPrice),
    formattedSavings: formatINR(0),
  };
}

/**
 * Calculates cart totals taking campaign discounts into account accurately
 */
export function calculateCartTotals(
  items: CartItem[],
  campaign?: FestiveCampaignConfig
) {
  let originalSubtotal = 0;
  let discountedSubtotal = 0;
  let totalSavings = 0;
  let totalItemsCount = 0;

  for (const item of items) {
    const qty = Math.max(1, item.quantity || 1);
    const priceInfo = calculateProductPrice(item.product, campaign);
    originalSubtotal += priceInfo.originalPrice * qty;
    discountedSubtotal += priceInfo.discountedPrice * qty;
    totalSavings += priceInfo.savings * qty;
    totalItemsCount += qty;
  }

  return {
    originalSubtotal,
    subtotal: discountedSubtotal,
    totalSavings,
    totalItemsCount,
    hasDiscount: totalSavings > 0,
    formattedOriginalSubtotal: formatINR(originalSubtotal),
    formattedSubtotal: formatINR(discountedSubtotal),
    formattedTotalSavings: formatINR(totalSavings),
  };
}
