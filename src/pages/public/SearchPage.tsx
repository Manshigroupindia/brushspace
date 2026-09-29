import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { ProductCard } from '../../components/product/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products } = useStoreData();

  useEffect(() => {
    document.title = query ? `Search: "${query}" — BRUSHSPACE` : 'Search Artifacts — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const results = useMemo(() => {
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

  return (
    <div className="flex flex-col w-full">
      {/* Search Header */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-space-xl border-b border-outline-variant/15">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            Catalog Discovery
          </p>
          <h1 className="font-display text-display text-on-surface tracking-tight mb-6">
            Search Collections
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-2xl mx-auto">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[24px]">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, product code (BS-VAS), medium, or finish..."
              className="w-full bg-surface-container-lowest text-on-surface pl-12 pr-28 py-3.5 rounded-xl border border-outline-variant/30 font-body-md text-body-md outline-none focus:border-primary shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Suggested:</span>
            {['Vases', 'Bonsai', 'Mirror Mosaic', 'Trays', 'Terracotta', 'Gold Leaf'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-3 py-1 bg-surface rounded-full font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/15"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Area */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
        {query ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} for &ldquo;{query}&rdquo;
              </h2>
              {results.length > 0 && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSearchParams({});
                  }}
                  className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary underline"
                >
                  Clear Search
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-surface-container-low rounded-2xl border border-outline-variant/15 p-8 max-w-xl mx-auto">
                <span className="material-symbols-outlined text-[48px] text-outline mb-3">
                  search_off
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                  No matching artifacts found
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  We could not find anything matching &ldquo;{query}&rdquo;. Check spelling or explore our broader categories.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center px-8 py-3 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
                >
                  View All Pieces
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant font-body-md">
            Enter a query above to explore our handcrafted home décor catalog.
          </div>
        )}
      </section>
    </div>
  );
};
