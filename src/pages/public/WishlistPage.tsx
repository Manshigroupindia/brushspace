import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useStoreData } from '../../context/StoreDataContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const { products } = useStoreData();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Saved Artifacts — BRUSHSPACE Wishlist';
    window.scrollTo(0, 0);
  }, []);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id) && p.isActive);

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => addToCart(p, 1));
    showToast(`Added ${wishlistProducts.length} items to your Cart`, 'shopping_bag');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-gutter-desktop pt-space-md pb-space-lg">
        <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant mb-space-sm font-label-sm text-label-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-outline-variant font-light">/</span>
          <span className="text-on-surface font-semibold">Wishlist</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm pb-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-1">
              Personal Exhibition
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Curated Wishlist{' '}
              <span className="font-body-md text-body-md text-on-surface-variant font-normal align-middle ml-2">
                ({wishlistProducts.length} {wishlistProducts.length === 1 ? 'Piece' : 'Pieces'})
              </span>
            </h1>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="px-6 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
              >
                Move All to Cart
              </button>
            </div>
          )}
        </div>
        <div className="w-full h-px bg-surface-variant"></div>
      </section>

      {/* Grid or Empty */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-gutter-desktop pb-space-xl">
        {wishlistProducts.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 md:p-16 rounded-2xl text-center border border-outline-variant/15 shadow-sm max-w-2xl mx-auto my-8">
            <span className="material-symbols-outlined text-[56px] text-outline mb-4">
              favorite_border
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
              Your Curated Wishlist is Empty
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              Save your favorite sculptural vases, wirecraft trees, and decorative trays to review or order later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
            >
              BROWSE CATALOG
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
