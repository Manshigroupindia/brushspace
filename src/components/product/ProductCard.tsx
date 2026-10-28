import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useStoreData } from '../../context/StoreDataContext';
import { generateSingleProductWhatsAppUrl, recordOrderInquiry } from '../../utils/whatsapp';
import { calculateProductPrice } from '../../utils/campaign';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'editorial';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { settings } = useStoreData();

  const isFavorited = isInWishlist(product.id);
  const priceInfo = calculateProductPrice(product, settings.festiveCampaign);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(
      added ? `Saved ${product.name} to Wishlist` : `Removed ${product.name} from Wishlist`,
      'favorite'
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added ${product.name} to Cart`, 'shopping_bag');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    recordOrderInquiry(
      [
        {
          productName: product.name,
          productCode: product.productCode,
          price: priceInfo.discountedPrice,
          quantity: 1,
        },
      ],
      priceInfo.discountedPrice
    );
    const url = generateSingleProductWhatsAppUrl(
      product,
      1,
      `${window.location.origin}/product/${product.slug}`,
      settings.whatsappNumber,
      settings.festiveCampaign
    );
    window.open(url, '_blank');
  };

  const primaryImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';

  if (layout === 'editorial') {
    return (
      <div className="product-item group flex flex-col md:flex-row bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/15 h-full">
        <Link
          to={`/product/${product.slug}`}
          className="relative w-full md:w-1/2 aspect-square md:aspect-[4/3] bg-surface-container-low overflow-hidden block shrink-0"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 z-10">
            {priceInfo.isDiscounted && (
              <span className="bg-amber-600 text-white font-label-sm text-[9px] md:text-label-sm uppercase tracking-wider px-2 py-0.5 md:px-2.5 md:py-1 rounded shadow-sm font-bold">
                20% OFF
              </span>
            )}
            {product.featured && (
              <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[9px] md:text-label-sm uppercase tracking-wider md:tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded shadow-sm font-semibold">
                Bestseller
              </span>
            )}
            {product.newArrival && !product.featured && (
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] md:text-label-sm uppercase tracking-wider md:tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded shadow-sm font-semibold">
                New
              </span>
            )}
          </div>
          <button
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
            className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface/85 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-tertiary transition-colors shadow-sm z-10"
          >
            <span
              className={`material-symbols-outlined text-[16px] md:text-[18px] ${
                isFavorited ? 'text-tertiary material-symbols-fill' : ''
              }`}
            >
              favorite
            </span>
          </button>
        </Link>
        <div className="p-2.5 sm:p-3.5 md:p-6 lg:p-8 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[10px] md:text-label-sm mb-0.5 md:mb-1">
              <span className="uppercase tracking-wider md:tracking-widest text-primary font-semibold truncate max-w-[80px] md:max-w-none">{product.productCode}</span>
              <span className="truncate max-w-[70px] md:max-w-none">{product.material}</span>
            </div>
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="font-headline-sm text-[13px] sm:text-sm md:text-headline-md text-on-surface font-medium group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-1 leading-snug my-1 md:my-2">
                {product.name}
              </h3>
            </Link>
            <p className="hidden md:block font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
              {product.shortDescription}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-headline-sm text-[13px] sm:text-sm md:text-headline-sm text-primary font-bold">
                {product.price > 0 ? priceInfo.formattedDiscounted : 'Price on Request'}
              </span>
              {product.price > 0 && priceInfo.isDiscounted && (
                <span className="font-label-sm text-[11px] sm:text-label-sm text-outline line-through">
                  {priceInfo.formattedOriginal}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 md:gap-3 mt-2 sm:mt-4 md:mt-6 pt-2 md:pt-4 border-t border-outline-variant/15">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 md:py-2.5 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-[10px] md:text-label-md uppercase tracking-wider text-on-surface transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[14px] md:text-[16px]">shopping_bag</span>
              <span>Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-1.5 md:py-2.5 rounded bg-on-secondary-fixed hover:bg-primary text-surface font-label-md text-[10px] md:text-label-md uppercase tracking-wider transition-colors shadow-sm text-center active:scale-[0.98]"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-item group flex flex-col bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/15 h-full">
      <Link
        to={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-surface-container-low overflow-hidden block shrink-0"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {priceInfo.isDiscounted && (
            <span className="bg-amber-600 text-white font-label-sm text-[9px] sm:text-label-sm uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm font-bold">
              20% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[9px] sm:text-label-sm uppercase tracking-wider sm:tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm font-semibold">
              Bestseller
            </span>
          )}
          {product.newArrival && !product.featured && (
            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] sm:text-label-sm uppercase tracking-wider sm:tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm font-semibold">
              New
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface/85 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-tertiary transition-colors shadow-sm z-10"
        >
          <span
            className={`material-symbols-outlined text-[16px] sm:text-[18px] ${
              isFavorited ? 'text-tertiary material-symbols-fill' : ''
            }`}
          >
            favorite
          </span>
        </button>
      </Link>

      <div className="p-2.5 sm:p-3.5 md:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[10px] sm:text-label-sm uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">
            <span className="truncate max-w-[80px] sm:max-w-none">{product.productCode}</span>
            <span className="truncate max-w-[70px] sm:max-w-[120px]">{product.material}</span>
          </div>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-headline-sm text-[13px] sm:text-sm md:text-headline-sm text-on-surface font-medium group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.4em] mb-1 sm:mb-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-title-md text-[13px] sm:text-sm md:text-title-md text-primary font-bold">
              {product.price > 0 ? priceInfo.formattedDiscounted : 'Price on Request'}
            </span>
            {product.price > 0 && priceInfo.isDiscounted && (
              <span className="font-label-sm text-[11px] sm:text-label-sm text-outline line-through">
                {priceInfo.formattedOriginal}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 mt-2 sm:mt-4 pt-2 border-t border-outline-variant/15">
          <button
            onClick={handleAddToCart}
            className="w-full py-1.5 sm:py-2.5 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-[10px] sm:text-label-md uppercase tracking-wider text-on-surface transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">shopping_bag</span>
            <span>Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full py-1.5 sm:py-2.5 rounded bg-on-secondary-fixed hover:bg-primary text-surface font-label-md text-[10px] sm:text-label-md uppercase tracking-wider transition-colors shadow-sm text-center active:scale-[0.98]"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
