import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useStoreData } from '../../context/StoreDataContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { generateSingleProductWhatsAppUrl, recordOrderInquiry, formatINR } from '../../utils/whatsapp';
import { calculateProductPrice } from '../../utils/campaign';
import { RETURN_POLICY, SHIPPING_POLICY } from '../../utils/policyConstants';
import { SEO } from '../../components/common/SEO';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full animate-pulse">
      {/* Top Breadcrumb Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop pt-space-md pb-space-sm border-b border-outline-variant/15">
        <div className="h-4 w-56 bg-surface-container rounded"></div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column Gallery Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="w-full aspect-square rounded-2xl bg-surface-container-high"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface-container"></div>
              ))}
            </div>
          </div>

          {/* Right Column Content Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="h-4 w-32 bg-surface-container rounded"></div>
            <div className="h-8 w-4/5 bg-surface-container-high rounded"></div>
            <div className="h-4 w-40 bg-surface-container rounded"></div>
            <div className="h-28 w-full bg-surface-container-low rounded-xl"></div>
            <div className="h-20 w-full bg-surface-container rounded-lg"></div>
            <div className="h-14 w-full bg-surface-container rounded-lg"></div>
            <div className="h-12 w-full bg-surface-container-highest rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, settings, isLoading, getProductBySlugOrId } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('craftStory');

  // Targeted single-product state
  const [targetedProduct, setTargetedProduct] = useState<Product | null>(null);
  const [isTargetedLoading, setIsTargetedLoading] = useState(false);
  const [hasLookupFinished, setHasLookupFinished] = useState(false);
  const [targetedError, setTargetedError] = useState<string | null>(null);

  // 1. In-memory product lookup
  const inMemoryProduct = products.find(
    (p) =>
      p.slug.toLowerCase() === slug?.toLowerCase() ||
      p.id.toLowerCase() === slug?.toLowerCase() ||
      p.productCode.toLowerCase() === slug?.toLowerCase()
  );

  // Active product is either in-memory or targeted
  const product = inMemoryProduct || targetedProduct;

  // 2. Resolve product with targeted fallback on route change or direct mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setQuantity(1);
    setTargetedError(null);

    // If found in-memory, no need for targeted network call
    if (inMemoryProduct) {
      setHasLookupFinished(true);
      setIsTargetedLoading(false);
      return;
    }

    if (!slug) {
      setHasLookupFinished(true);
      return;
    }

    let isSubscribed = true;
    setIsTargetedLoading(true);
    setHasLookupFinished(false);

    getProductBySlugOrId(slug)
      .then((found) => {
        if (!isSubscribed) return;
        setTargetedProduct(found);
        setHasLookupFinished(true);
        setIsTargetedLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.warn('Direct product fetch error:', err);
        setTargetedError('Unable to load artifact at this time. Please check your connection.');
        setHasLookupFinished(true);
        setIsTargetedLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [slug, inMemoryProduct, getProductBySlugOrId]);

  // Loading state: Show skeleton while request is unresolved
  const isResolving = (!product && (isLoading || isTargetedLoading)) || (!hasLookupFinished && !product);

  if (isResolving) {
    return <ProductDetailSkeleton />;
  }

  // Error state: If network or permission error occurred
  if (!product && targetedError) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile py-24 text-center">
        <SEO title="Error Loading Product | Brushspace" canonical="/404" />
        <span className="material-symbols-outlined text-[48px] text-tertiary mb-3">error_outline</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">Unable to Load Artifact</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
          {targetedError}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Try Again</span>
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors"
          >
            Explore All Pieces
          </Link>
        </div>
      </div>
    );
  }

  // Genuine Not Found: Both collection and targeted query completed without finding product
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile py-24 text-center">
        <SEO title="Product Not Found | Brushspace" canonical="/404" />
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Product Not Found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          The handcrafted piece you are looking for has been archived or does not exist.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
        >
          Explore All Pieces
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const activeImage =
    (product.images && product.images[activeImageIndex]) ||
    (product.images && product.images[0]) ||
    'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg';

  // Centralized price calculation with festive discount
  const priceInfo = calculateProductPrice(product, settings.festiveCampaign);

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    showToast(
      added ? `Saved ${product.name} to Wishlist` : `Removed ${product.name} from Wishlist`,
      'favorite'
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.name} to Cart`, 'shopping_bag');
  };

  const handleBuyNow = () => {
    recordOrderInquiry(
      [
        {
          productName: product.name,
          productCode: product.productCode,
          price: priceInfo.discountedPrice,
          quantity,
        },
      ],
      priceInfo.discountedPrice * quantity
    );

    const url = generateSingleProductWhatsAppUrl(
      product,
      quantity,
      window.location.href,
      settings.whatsappNumber,
      settings.festiveCampaign
    );
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Artifact link copied to clipboard', 'content_copy');
    }
  };

  const toggleAccordionItem = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col w-full">
      <SEO
        title={`${product.name} | Brushspace`}
        description={product.description || product.shortDescription || 'Discover handcrafted artistic home décor pieces from Brushspace.'}
        canonical={`/product/${product.slug}`}
        image={(product.images && product.images[0]) || 'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg'}
        type="product"
        price={priceInfo.discountedPrice}
        availability="in stock"
      />

      {/* Top Breadcrumb & Quick Actions Bar */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop pt-space-md pb-space-sm border-b border-outline-variant/15">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-outline-variant font-light">/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span className="text-outline-variant font-light">/</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <span className="text-outline-variant font-light">/</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="flex items-center gap-space-md">
            <button
              onClick={handleShare}
              className="flex items-center gap-space-xs text-on-surface-variant hover:text-primary font-label-sm text-label-sm uppercase tracking-widest transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share Artifact</span>
            </button>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <button
              onClick={handleWishlistToggle}
              className="flex items-center gap-space-xs text-on-surface-variant hover:text-tertiary font-label-sm text-label-sm uppercase tracking-widest transition-colors"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isFavorited ? 'text-tertiary material-symbols-fill' : ''
                }`}
              >
                favorite
              </span>
              <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Primary Gallery Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/15 shadow-sm group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Badges Container (Top Left) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {priceInfo.isDiscounted && (
                  <span className="bg-amber-600 text-white font-label-sm text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md font-bold flex items-center gap-1.5">
                    <span>🎉</span>
                    <span>{settings.festiveCampaign?.campaignName || 'FESTIVE SALE'} · {priceInfo.discountPercentage}% OFF</span>
                  </span>
                )}
                {product.featured && (
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 rounded shadow-sm font-semibold">
                    Studio Signature Selection
                  </span>
                )}
                {product.newArrival && !product.featured && (
                  <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 rounded shadow-sm font-semibold">
                    New Studio Edition
                  </span>
                )}
              </div>

              {/* Wishlist Button Overlay (Top Right) */}
              <button
                onClick={handleWishlistToggle}
                aria-label="Save to Wishlist"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-tertiary transition-colors shadow-md z-10"
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isFavorited ? 'text-tertiary material-symbols-fill' : ''
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-space-xs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden bg-surface-container-low border-2 transition-all duration-200 ${
                      activeImageIndex === idx
                        ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Curatorial Details & WhatsApp Buy Flow (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
                <span className="text-primary font-bold">{product.productCode}</span>
                <span>•</span>
                <span>{product.category}</span>
                {product.subcategory && (
                  <>
                    <span>•</span>
                    <span>{product.subcategory}</span>
                  </>
                )}
              </div>

              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight mt-1">
                {product.name}
              </h1>

              {/* Reviews & Social Proof */}
              <div className="flex items-center gap-space-sm mt-1">
                <div className="flex items-center text-primary-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px] material-symbols-fill">
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label-md text-label-md text-on-surface font-bold">4.9</span>
                <span className="text-outline-variant">•</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant underline decoration-outline-variant underline-offset-4">
                  Collector Verified
                </span>
              </div>
            </div>

            {/* Price & Availability Block */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/15">
              {priceInfo.isDiscounted && (
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-600/30 text-amber-900 dark:text-amber-200 font-label-sm text-[11px] uppercase tracking-wider font-bold">
                    <span>🎉</span>
                    <span>{settings.festiveCampaign?.campaignName || 'FESTIVE SALE'} · {priceInfo.discountPercentage}% OFF</span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-label-sm text-[12px] font-semibold">
                    Save {priceInfo.formattedSavings}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">
                    {product.price > 0 ? priceInfo.formattedDiscounted : 'Price on Request'}
                  </span>
                  {product.price > 0 && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant">INR</span>
                  )}
                  {product.price > 0 && priceInfo.isDiscounted && (
                    <span className="font-body-sm text-body-sm text-outline line-through ml-2">
                      {priceInfo.formattedOriginal}
                    </span>
                  )}
                  {product.price > 0 && !priceInfo.isDiscounted && product.compareAtPrice && (
                    <span className="font-body-sm text-body-sm text-outline line-through ml-2">
                      {formatINR(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  {product.stockStatus === 'in_stock'
                    ? 'In Studio Stock'
                    : product.stockStatus === 'made_to_order'
                    ? 'Made to Order'
                    : 'Limited Batch'}
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Includes all bespoke studio taxes &amp; archival protective packing
              </p>
            </div>

            {/* Curatorial Description */}
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {product.description}
            </p>

            {/* Material Badges Matrix */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1.5 border border-outline-variant/15">
                <span className="material-symbols-outlined text-[15px] text-primary">circle</span>
                {product.material}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1.5 border border-outline-variant/15">
                <span className="material-symbols-outlined text-[15px] text-primary">palette</span>
                {product.color}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm tracking-wider uppercase flex items-center gap-1.5 border border-outline-variant/15">
                <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                Studio Signed
              </span>
            </div>

            {/* Quick Spec Grid */}
            <div className="grid grid-cols-3 gap-space-xs py-space-sm px-space-md rounded-xl bg-surface-container text-center border border-outline-variant/15">
              <div className="flex flex-col py-1">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Height</span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                  {product.dimensions.height || '32 cm'}
                </span>
              </div>
              <div className="flex flex-col py-1 bg-surface/50 rounded-lg">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Diameter/Width</span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                  {product.dimensions.width || product.dimensions.diameter || '18 cm'}
                </span>
              </div>
              <div className="flex flex-col py-1">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Weight</span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                  {product.dimensions.weight || '1.8 kg'}
                </span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col gap-space-md">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">
                  Select Edition Quantity
                </span>
                <div className="inline-flex items-center bg-surface-container rounded-lg p-1 border border-outline-variant/20">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-10 text-center font-title-md text-title-md font-semibold text-on-surface">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Dual Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-lg bg-surface-container-highest text-on-secondary-fixed hover:bg-secondary-container transition-all duration-200 font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-space-xs shadow-sm hover:shadow active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 px-6 rounded-lg bg-on-secondary-fixed text-surface hover:bg-primary transition-all duration-200 font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px] text-inverse-primary">bolt</span>
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Requirement 1: Clearly Visible Professional No-Return, No-Refund, No-Exchange Policy */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>{RETURN_POLICY.BADGE}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {RETURN_POLICY.FULL_TEXT}
                </p>
                <Link
                  to="/return-policy"
                  className="text-primary font-label-sm text-label-sm uppercase tracking-wider hover:underline inline-flex items-center gap-1 font-semibold mt-0.5"
                >
                  <span>Review full policy guidelines</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>

              {/* Requirement 2: Shipping Charges Notice */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-on-surface font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  <span>{SHIPPING_POLICY.TITLE}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {SHIPPING_POLICY.NOTICE}
                </p>
              </div>

              {/* Interactive WhatsApp Message Live Preview Card */}
              <div className="rounded-xl bg-secondary-container/40 p-space-md flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    WhatsApp Atelier Order Inquiry Preview
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {todayFormatted}
                  </span>
                </div>
                {/* WhatsApp Message Bubble Look */}
                <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm font-mono text-[12px] text-on-surface flex flex-col gap-1.5 leading-relaxed border border-outline-variant/10 select-all whitespace-pre-wrap">
{`Hello, I am interested in placing an order.

Products:
${product.name} — ${product.productCode}
Price: ${priceInfo.formattedDiscounted}
Quantity: ${quantity}
Subtotal: ${formatINR(priceInfo.discountedPrice * quantity)}

Shipping: Payable by customer; final charges to be confirmed separately.
Return Policy: No return, no refund and no exchange, subject to applicable law.
Product Link: ${window.location.href}

Please confirm the shipping charges, availability and next steps for placing my order.`}
                </div>
              </div>
            </div>

            {/* Architectural Accordions for Atelier Details */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              {/* Accordion 1: Story */}
              <div className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/15">
                <button
                  onClick={() => toggleAccordionItem('craftStory')}
                  className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">brush</span>
                    1. Story &amp; Craftsmanship
                  </span>
                  <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openAccordion === 'craftStory' ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 'craftStory' && (
                  <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed flex flex-col gap-2">
                    <p>
                      Each {product.name} is shaped individually in our atelier using mineral-rich natural earthen materials. The silhouette evokes quiet architectural grace and tactile longing.
                    </p>
                    <p>
                      Following kiln firing, master craftspeople treat each surface by hand with artisanal oxidation coats, brass leafing, or hand-set mosaics across multiple careful drying sessions.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Specs */}
              <div className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/15">
                <button
                  onClick={() => toggleAccordionItem('specsDim')}
                  className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">straighten</span>
                    2. Specifications &amp; Dimensions
                  </span>
                  <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openAccordion === 'specsDim' ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 'specsDim' && (
                  <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 py-2 font-body-sm text-body-sm">
                      {(product.dimensions as any).raw ? (
                        <div><span className="font-semibold text-on-surface">Dimensions:</span> {(product.dimensions as any).raw}</div>
                      ) : (
                        <>
                          <div><span className="font-semibold text-on-surface">Height:</span> {product.dimensions.height || '—'}</div>
                          <div><span className="font-semibold text-on-surface">Diameter/Width:</span> {product.dimensions.width || product.dimensions.diameter || '—'}</div>
                        </>
                      )}
                      <div><span className="font-semibold text-on-surface">Weight:</span> {product.dimensions.weight || '—'}</div>
                      <div><span className="font-semibold text-on-surface">Primary Material:</span> {product.material || 'Artisanal Medium'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Safe Transit */}
              <div className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/15">
                <button
                  onClick={() => toggleAccordionItem('safeTransit')}
                  className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">local_shipping</span>
                    3. Packaging &amp; Safe Transit
                  </span>
                  <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openAccordion === 'safeTransit' ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 'safeTransit' && (
                  <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                    All pieces travel in reinforced triple-layered shock-absorbing cushions within sturdy outer crates. Shatter-safe guaranteed transit pan-India.
                  </div>
                )}
              </div>

              {/* Accordion 4: Care */}
              <div className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/15">
                <button
                  onClick={() => toggleAccordionItem('careInfo')}
                  className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">cleaning_services</span>
                    4. Studio Care Instructions
                  </span>
                  <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-300 ${openAccordion === 'careInfo' ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordion === 'careInfo' && (
                  <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                    Gently dust with a dry, soft microfiber cloth. Avoid abrasive chemical cleaning sprays or soaking in water to preserve delicate leafing and natural earthen patina.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
