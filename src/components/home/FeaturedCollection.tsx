import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedCollection: React.FC = () => {
  const { products, categories, isLoading } = useStoreData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = useMemo(() => {
    const tabs: Array<{ id: string; label: string }> = [{ id: 'all', label: 'All' }];
    categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 5)
      .forEach((cat) => {
        tabs.push({ id: cat.slug, label: cat.name });
      });
    return tabs;
  }, [categories]);

  const displayedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isActive);
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase() === selectedFilter.toLowerCase() ||
          categories.some(
            (c) =>
              c.slug.toLowerCase() === selectedFilter.toLowerCase() &&
              p.category.toLowerCase() === c.name.toLowerCase()
          )
      );
    }
    // Limit to top 8 items for the home featured view
    return filtered.slice(0, 8);
  }, [products, categories, selectedFilter]);

  return (
    <section className="w-full bg-surface-container py-space-xl" id="featured-collection">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop">
        <div className="flex flex-col items-center text-center mb-10">
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            Handpicked Edit
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">
            Curated For Your Space
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl leading-relaxed">
            Signature handcrafted pieces celebrating tactile beauty, subtle balance, and rich earthy patinas.
          </p>

          {/* Category Filters */}
          {filterTabs.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-5 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors ${
                    selectedFilter === tab.id
                      ? 'bg-on-secondary-fixed text-surface'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid / Empty State */}
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/15 flex flex-col">
                <div className="w-full aspect-[4/5] bg-surface-container-high"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-variant rounded w-2/3"></div>
                  <div className="h-3 bg-surface-variant/60 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-on-surface-variant font-body-md bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
            No pieces currently available in this curation.
          </div>
        )}
      </div>
    </section>
  );
};
