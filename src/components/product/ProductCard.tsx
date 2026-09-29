import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useStoreData } from '../../context/StoreDataContext';
import { generateSingleProductWhatsAppUrl, recordOrderInquiry, formatINR } from '../../utils/whatsapp';

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
          price: product.price,
          quantity: 1,
        },
      ],
      product.price
    );
    const url = generateSingleProductWhatsAppUrl(
      product,
      1,
      `${window.location.origin}/product/${product.slug}`,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';

  if (layout === 'editorial') {
    return (
      <div className="product-item group flex flex-col md:flex-row bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/15">
        <Link
          to={`/product/${product.slug}`}
          className="relative w-full md:w-1/2 aspect-[4/3] bg-surface-container-low overflow-hidden block"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-widest px-2.5 py-1 rounded">
              Bestseller
            </span>
          )}
          {product.newArrival && !product.featured && (
            <span className="absolute top-3 left-3 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest px-2.5 py-1 rounded">
              New
            </span>
          )}
          <button
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-tertiary transition-colors shadow-sm"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isFavorited ? 'text-tertiary material-symbols-fill' : ''
              }`}
            >
              favorite
            </span>
          </button>
        </Link>
        <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-1">
              <span className="uppercase tracking-widest text-primary font-semibold">{product.productCode}</span>
              <span>{product.material}</span>
            </div>
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-2 font-medium group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
              {product.shortDescription}
            </p>
            <p className="font-headline-sm text-headline-sm text-primary font-bold">
              {formatINR(product.price)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-outline-variant/15">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 rounded bg-on-secondary-fixed hover:bg-primary text-surface font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-item group flex flex-col bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/15">
      <Link
        to={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-surface-container-low overflow-hidden block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-widest px-2.5 py-1 rounded">
            Bestseller
          </span>
        )}
        {product.newArrival && !product.featured && (
          <span className="absolute top-3 left-3 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest px-2.5 py-1 rounded">
            New
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-tertiary transition-colors shadow-sm"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              isFavorited ? 'text-tertiary material-symbols-fill' : ''
            }`}
          >
            favorite
          </span>
        </button>
      </Link>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
            <span>{product.productCode}</span>
            <span className="text-[10px] truncate max-w-[120px]">{product.material}</span>
          </div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-2 font-medium group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="font-title-md text-title-md text-primary font-semibold">
            {formatINR(product.price)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span> Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full py-2.5 rounded bg-on-secondary-fixed hover:bg-primary text-surface font-label-md text-label-md uppercase tracking-wider transition-colors shadow-sm"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
