import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { formatINR } from '../../utils/whatsapp';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products } = useStoreData();
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(q) ||
          p.productCode.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [query, products]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-on-secondary-fixed/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant/20 overflow-hidden">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center mb-4">
          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[24px]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, code (BS-VAS), category, tags..."
            className="w-full bg-surface-container-lowest text-on-surface pl-12 pr-12 py-3.5 rounded-xl border border-outline-variant/30 font-body-md text-body-md outline-none focus:border-primary shadow-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="absolute right-3 p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </form>

        {/* Quick Tag Suggestions */}
        {!query && (
          <div className="py-2">
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-2">
              Popular Searches:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Vases', 'Bonsai', 'Mirror Mosaic', 'Trays', 'Terracotta', 'Gold Leaf'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-outline-variant/15 mt-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 px-2 hover:bg-surface-container-low rounded-lg transition-colors group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-surface-container shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-medium">
                      {product.productCode} • {product.category}
                    </p>
                    <h4 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {product.material}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-title-md text-title-md font-semibold text-primary">
                      {formatINR(product.price)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-[40px] text-outline mb-2">
                  search_off
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  No artistic pieces found for “{query}”
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Try searching by medium, product code, or exploring all catalog items.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="mt-4 px-6 py-2 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
                >
                  View All Collections
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Matches Footer */}
        {filteredProducts.length > 8 && (
          <div className="pt-3 border-t border-outline-variant/15 text-center">
            <button
              onClick={() => {
                onClose();
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
              className="font-label-md text-label-md uppercase tracking-wider text-primary hover:underline font-semibold"
            >
              View all {filteredProducts.length} matching pieces &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
