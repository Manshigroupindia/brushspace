import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/whatsapp';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    totalAmount,
    isFreeShippingUnlocked,
    buyNowWhatsApp,
  } = useCart();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Your Curated Bag — BRUSHSPACE';
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
                ({items.length} {items.length === 1 ? 'Item' : 'Items'})
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[18px] text-primary material-symbols-fill">
              verified
            </span>
            <span>Items reserved in studio stock for 45:00 min</span>
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
              {/* Complimentary Shipping Callout */}
              <div className="bg-secondary-container/40 p-space-md rounded-xl flex items-center justify-between border border-outline-variant/15">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    local_shipping
                  </span>
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-secondary-fixed font-semibold">
                      Complimentary Studio White-Glove Shipping
                    </span>
                    <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant">
                      {isFreeShippingUnlocked
                        ? 'Qualified: Your bag total exceeds the ₹5,000 threshold.'
                        : `Add ${formatINR(5000 - subtotal)} more to unlock complimentary white-glove shipping.`}
                    </span>
                  </div>
                </div>
                <span className={`font-label-sm text-label-sm uppercase tracking-widest px-space-sm py-1 rounded font-semibold ${
                  isFreeShippingUnlocked ? 'bg-surface text-primary' : 'bg-surface/60 text-outline'
                }`}>
                  {isFreeShippingUnlocked ? 'UNLOCKED' : 'STANDARD'}
                </span>
              </div>

              {/* Items List */}
              {items.map((item) => (
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
                    <span className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider text-on-surface">
                      Gallery Piece
                    </span>
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
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {formatINR(item.product.price)} each
                          </span>
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
              ))}

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
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-on-surface">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>Safe Protective Packaging</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-outline cursor-help"
                        title="Reinforced shock-absorbing foam & wooden framing for ceramics"
                      >
                        info
                      </span>
                    </span>
                    <span className="text-primary font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>Studio Insured Shipping</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-outline cursor-help"
                        title="Free on all orders exceeding ₹5,000"
                      >
                        info
                      </span>
                    </span>
                    <span className="text-primary font-medium">
                      {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-surface-variant my-space-sm"></div>

                <div className="flex justify-between items-baseline mb-space-lg pt-space-xs">
                  <div>
                    <span className="font-title-md text-title-md text-on-surface block font-semibold">
                      Total Amount
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Inclusive of all studio artisanal taxes
                    </span>
                  </div>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {formatINR(totalAmount)}
                  </span>
                </div>

                {/* Primary BUY NOW Button */}
                <button
                  type="button"
                  onClick={() => buyNowWhatsApp()}
                  className="w-full bg-on-secondary-fixed text-surface py-4 px-space-md rounded-lg font-title-md text-title-md uppercase tracking-wider hover:bg-primary transition-all duration-300 flex items-center justify-center gap-space-sm shadow-md active:scale-[0.99]"
                >
                  <span>BUY NOW</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>

              {/* Direct Studio WhatsApp Flow Preview Box */}
              <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/15">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface font-semibold">
                      Direct Studio WhatsApp Flow
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  When you click <strong className="text-on-surface font-medium">BUY NOW</strong>, our studio will receive this pre-formatted message:
                </p>

                {/* Pre-formatted message card */}
                <div className="bg-surface p-space-sm rounded font-mono text-[11px] leading-relaxed text-on-surface-variant shadow-inner border border-outline-variant/10 overflow-x-auto whitespace-pre-wrap select-all">
{`Hello, I am interested in ordering the following products.

${items.map((it, idx) => `${idx + 1}. ${it.product.name}\n   Product Code: ${it.product.productCode}\n   Price: ${formatINR(it.product.price)}\n   Quantity: ${it.quantity}`).join('\n\n')}

Total: ${formatINR(totalAmount)}

Cart Link: ${window.location.href}

Please share the next steps for placing the order.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
