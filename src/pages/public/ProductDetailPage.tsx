import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { generateSingleProductWhatsAppUrl, recordOrderInquiry, formatINR } from '../../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, settings } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('craftStory');

  // Find product by slug or id or productCode
  const product = products.find(
    (p) =>
      p.slug.toLowerCase() === slug?.toLowerCase() ||
      p.id.toLowerCase() === slug?.toLowerCase() ||
      p.productCode.toLowerCase() === slug?.toLowerCase()
  );

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — BRUSHSPACE`;
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile py-24 text-center">
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
  const activeImage = product.images[activeImageIndex] || product.images[0];

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
          price: product.price,
          quantity,
        },
      ],
      product.price * quantity
    );

    const url = generateSingleProductWhatsAppUrl(
      product,
      quantity,
      window.location.href,
      settings.whatsappNumber
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
              <span>{isFavorited ? 'In Wishlist' : 'Curate to Wishlist'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Showcase: Architectural Two-Column Split Grid */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-md lg:py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter-desktop items-start">
          {/* LEFT COLUMN: Gallery (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Main Focal Frame */}
            <div className="relative w-full aspect-[4/5] rounded-xl bg-surface-container-low overflow-hidden shadow-sm group border border-outline-variant/20">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm font-label-sm text-label-sm uppercase tracking-wider text-on-secondary-fixed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Authentic Studio Handcraft
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/90 backdrop-blur-md font-label-sm text-label-sm tracking-widest text-on-secondary-fixed-variant uppercase">
                  Batch: #04/2025
                </span>
              </div>
            </div>

            {/* Thumbnails Multi-Angle Mosaic */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-space-sm sm:gap-space-md">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-surface-container-low transition-all duration-300 shadow-sm border ${
                      activeImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/20 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Craftsmanship Authenticity Bento */}
            <div className="mt-space-sm p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border border-outline-variant/15">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <p className="font-title-md text-title-md text-on-surface">Numbered Studio Certificate</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Hand-signed by Master Potter &amp; Artisan Studio
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-widest font-semibold">
                <span>Archival Edition</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Curatorial Narrative & Studio Actions (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg lg:pl-space-sm">
            {/* Header & Signature Tag */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary font-semibold">
                  BRUSHSPACE Atelier • Signature Collection
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full border border-outline-variant/20">
                  Code: {product.productCode}
                </span>
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
                  28 collector reviews
                </span>
              </div>
            </div>

            {/* Price & Availability Block */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/15">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg font-normal text-on-surface">
                    {formatINR(product.price)}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">INR</span>
                  {product.compareAtPrice && (
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
                Includes all bespoke taxes &amp; archival packaging within India
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

              {/* Direct WhatsApp Dispatch Notice */}
              <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant border border-outline-variant/15">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  forum
                </span>
                <p className="font-body-sm text-body-sm leading-relaxed">
                  When clicking <strong className="text-on-surface font-medium">BUY NOW</strong>, you will connect directly with our studio via WhatsApp with your order specifications and shipping address query pre-filled.
                </p>
              </div>

              {/* Interactive WhatsApp Message Live Preview Card */}
              <div className="rounded-xl bg-secondary-container/40 p-space-md flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    WhatsApp Atelier Dispatch Preview
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {todayFormatted}
                  </span>
                </div>
                {/* WhatsApp Message Bubble Look */}
                <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm font-body-sm text-body-sm text-on-surface flex flex-col gap-1 leading-relaxed border border-outline-variant/10">
                  <p className="text-on-surface-variant font-medium">Hello, I am interested in ordering this product.</p>
                  <div className="pl-2 border-l-2 border-primary/40 my-1 text-on-surface-variant text-[13px] flex flex-col gap-0.5">
                    <p><span className="font-medium text-on-surface">Product:</span> {product.name}</p>
                    <p><span className="font-medium text-on-surface">Product Code:</span> {product.productCode}</p>
                    <p><span className="font-medium text-on-surface">Price:</span> {formatINR(product.price)}</p>
                    <p><span className="font-medium text-on-surface">Quantity:</span> {quantity} (Total: {formatINR(product.price * quantity)})</p>
                    <p><span className="font-medium text-on-surface">Date:</span> {todayFormatted}</p>
                    <p><span className="font-medium text-on-surface">Product Link:</span> <span className="text-primary underline">{window.location.href}</span></p>
                  </div>
                  <p className="text-on-surface-variant font-medium pt-1">
                    Please share the next steps for placing the order.
                  </p>
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
                      <div><span className="font-semibold text-on-surface">Height:</span> {product.dimensions.height || '32 cm'}</div>
                      <div><span className="font-semibold text-on-surface">Diameter/Width:</span> {product.dimensions.width || product.dimensions.diameter || '18 cm'}</div>
                      <div><span className="font-semibold text-on-surface">Weight:</span> {product.dimensions.weight || '1.8 kg'}</div>
                      <div><span className="font-semibold text-on-surface">Primary Material:</span> {product.material}</div>
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
