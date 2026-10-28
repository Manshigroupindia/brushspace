import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useStoreData } from '../../context/StoreDataContext';
import { formatINR } from '../../utils/whatsapp';
import { calculateProductPrice } from '../../utils/campaign';
import { RETURN_POLICY, SHIPPING_POLICY } from '../../utils/policyConstants';
import { SEO } from '../../components/common/SEO';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    originalSubtotal,
    totalSavings,
    totalAmount,
    buyNowWhatsApp,
  } = useCart();
  const { settings } = useStoreData();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    addToWishlist(item.product);
    removeFromCart(item.product.id);
    showToast(`Moved ${item.product.name} to Wishlist`, 'favorite');
  };

  const handleRemove = (item: (typeof items)[0]) => {
    removeFromCart(item.product.id);
    showToast(`Removed ${item.product.name} from Cart`, 'delete');
  };

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="Your Curated Bag | Brushspace"
        description="Review items in your shopping bag and checkout securely via WhatsApp."
        canonical="/cart"
        type="website"
      />
      {/* Editorial Breadcrumb & Header Section */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-gutter-desktop pt-space-md pb-space-lg">
        <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant mb-space-sm font-label-sm text-label-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-outline-variant font-light">/</span>
          <span className="text-on-surface font-semibold">Cart</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm pb-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-1">
              Acquisitions in Curation
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Your Curated Bag{' '}
              <span className="font-body-md text-body-md text-on-surface-variant font-normal align-middle ml-2">
                ({items.length} {items.length === 1 ? 'Piece' : 'Pieces'})
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[18px] text-primary material-symbols-fill">
              verified
            </span>
            <span>Studio handcrafted artifacts</span>
          </div>
        </div>
        <div className="w-full h-px bg-surface-variant"></div>
      </section>

      {/* Main Cart Section */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-gutter-desktop pb-space-xl">
        {items.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 md:p-16 rounded-2xl text-center border border-outline-variant/15 shadow-sm max-w-2xl mx-auto my-8">
            <span className="material-symbols-outlined text-[56px] text-outline mb-4">
              shopping_bag
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
              Your Curated Bag is Empty
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              Explore our handcrafted collection of terracotta vessels, wire trees, and reflective mosaic pieces to begin styling your space.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Column: Cart Items List (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* Requirement 2: Clearly communicate shipping charges notice */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm border border-outline-variant/20 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
                  local_shipping
                </span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    {SHIPPING_POLICY.TITLE}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    {SHIPPING_POLICY.NOTICE}
                  </span>
                </div>
              </div>

              {/* Items List */}
              {items.map((item) => {
                const itemPriceInfo = calculateProductPrice(item.product, settings.festiveCampaign);
                const itemSubtotal = itemPriceInfo.discountedPrice * item.quantity;

                return (
                  <article
                    key={item.product.id}
                    className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col sm:flex-row gap-space-md relative group transition-all duration-300 hover:shadow-md border border-outline-variant/15"
                  >
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-full sm:w-36 h-44 rounded-lg overflow-hidden bg-surface-container-low shrink-0 relative block"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {itemPriceInfo.isDiscounted && (
                        <span className="absolute top-2 left-2 bg-amber-600 text-white font-label-sm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm font-bold">
                          20% OFF
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-col justify-between flex-grow min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-space-sm">
                          <div>
                            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                              Code: {item.product.productCode}
                            </span>
                            <Link to={`/product/${item.product.slug}`}>
                              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 leading-snug hover:text-primary transition-colors">
                                {item.product.name}
                              </h2>
                            </Link>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                              Material: {item.product.material}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold block">
                              {formatINR(itemSubtotal)}
                            </span>
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                {formatINR(itemPriceInfo.discountedPrice)} each
                              </span>
                              {itemPriceInfo.isDiscounted && (
                                <span className="font-label-sm text-[11px] text-outline line-through">
                                  {formatINR(itemPriceInfo.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-md mt-space-sm border-t border-outline-variant/10">
                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="font-body-md text-body-md font-semibold px-4 text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-space-md">
                          <button
                            type="button"
                            onClick={() => handleMoveToWishlist(item)}
                            className="font-body-sm text-body-sm text-on-surface-variant hover:text-tertiary flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">favorite</span>
                            <span>Move to Wishlist</span>
                          </button>
                          <span className="text-surface-variant">|</span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="font-body-sm text-body-sm text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Bottom Actions */}
              <div className="pt-space-sm flex items-center justify-between">
                <Link
                  to="/shop"
                  className="font-title-md text-title-md text-on-surface hover:text-primary flex items-center gap-space-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span>Continue Exploring Collections</span>
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-label-sm text-label-sm uppercase tracking-wider text-outline hover:text-error transition-colors"
                >
                  Clear Entire Bag
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & WhatsApp Flow (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Order Summary Card */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/15">
                <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/15">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Order Summary</h2>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded font-semibold">
                    {items.length} {items.length === 1 ? 'Object' : 'Objects'}
                  </span>
                </div>

                <div className="space-y-space-sm font-body-md text-body-md py-space-sm">
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Original Subtotal</span>
                      <span className="text-outline line-through">{formatINR(originalSubtotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-on-surface">{formatINR(subtotal)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-medium">
                      <span>Festive Bonanza (20% OFF)</span>
                      <span>- {formatINR(totalSavings)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>Safe Protective Packaging</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-outline cursor-help"
                        title="Reinforced shock-absorbing foam & packaging for ceramic art"
                      >
                        info
                      </span>
                    </span>
                    <span className="text-primary font-medium">Complimentary</span>
                  </div>

                  <div className="flex justify-between items-baseline text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>Shipping Charges</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-outline cursor-help"
                        title="Shipping is payable by the customer based on package dimensions and delivery location."
                      >
                        info
                      </span>
                    </span>
                    <span className="text-on-surface font-medium text-right text-[13px]">
                      Payable by customer
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-surface-variant my-space-sm"></div>

                <div className="flex justify-between items-baseline mb-space-sm pt-space-xs">
                  <div>
                    <span className="font-title-md text-title-md text-on-surface block font-semibold">
                      Total Subtotal
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Shipping to be confirmed separately
                    </span>
                  </div>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {formatINR(totalAmount)}
                  </span>
                </div>

                {/* Requirement 1: Short version of policy before proceeding to WhatsApp */}
                <div className="my-space-md p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-primary font-label-sm text-[11px] uppercase tracking-wider font-bold">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>{RETURN_POLICY.BADGE}</span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                    {RETURN_POLICY.SHORT_TEXT}
                  </p>
                  <Link to="/return-policy" className="text-primary text-[11px] uppercase tracking-wider hover:underline font-semibold inline-flex items-center gap-1">
                    <span>View Full Policy</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Primary BUY NOW WhatsApp Button */}
                <button
                  type="button"
                  onClick={() => buyNowWhatsApp()}
                  className="w-full bg-on-secondary-fixed text-surface py-4 px-space-md rounded-lg font-title-md text-title-md uppercase tracking-wider hover:bg-primary transition-all duration-300 flex items-center justify-center gap-space-sm shadow-md active:scale-[0.99]"
                >
                  <span>BUY NOW VIA WHATSAPP</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              {/* Direct Studio WhatsApp Flow Preview Box */}
              <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/15">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface font-semibold">
                      Direct Studio WhatsApp Flow Preview
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  When you click <strong className="text-on-surface font-medium">BUY NOW VIA WHATSAPP</strong>, our studio will receive this formatted order enquiry:
                </p>

                {/* Pre-formatted message card */}
                <div className="bg-surface p-space-sm rounded font-mono text-[11px] leading-relaxed text-on-surface-variant shadow-inner border border-outline-variant/10 overflow-x-auto whitespace-pre-wrap select-all">
{`Hello, I am interested in placing an order.

Products:
${items.map((it, idx) => {
  const pInfo = calculateProductPrice(it.product, settings.festiveCampaign);
  return `${idx + 1}. ${it.product.name} — ${it.product.productCode}\n   Price: ${pInfo.formattedDiscounted}\n   Quantity: ${it.quantity}\n   Subtotal: ${formatINR(pInfo.discountedPrice * it.quantity)}`;
}).join('\n\n')}

Subtotal: ${formatINR(totalAmount)}
Shipping: Payable by customer; final charges to be confirmed separately.
Return Policy: No return, no refund and no exchange, subject to applicable law.
Cart Link: ${window.location.href}

Please confirm the shipping charges, availability and next steps for placing my order.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
