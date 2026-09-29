import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { ProductCard } from '../../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories, isLoading } = useStoreData();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'editorial'>('grid');

  useEffect(() => {
    document.title = 'Shop Artistic Décor — BRUSHSPACE Catalog';
    window.scrollTo(0, 0);

    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  const materialsList = ['Terracotta', 'Clay', 'Beads', 'Leaves', 'Rhinestones', 'Ceramic', 'Brass'];

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedSort('featured');
    setSelectedMaterials([]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedSort !== 'featured' ||
    selectedMaterials.length > 0;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCode = p.productCode.toLowerCase().includes(q);
          const matchMaterial = p.material.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchCode && !matchMaterial && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Price range filter
        if (selectedPriceRange === 'under-2500') {
          if (p.price >= 2500) return false;
        } else if (selectedPriceRange === '2500-4500') {
          if (p.price < 2500 || p.price > 4500) return false;
        } else if (selectedPriceRange === '4500-plus') {
          if (p.price < 4500) return false;
        }

        // Material filter
        if (selectedMaterials.length > 0) {
          const hasMaterial = selectedMaterials.some((mat) =>
            p.material.toLowerCase().includes(mat.toLowerCase())
          );
          if (!hasMaterial) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-low') {
          return a.price - b.price;
        }
        if (selectedSort === 'price-high') {
          return b.price - a.price;
        }
        if (selectedSort === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedSort, selectedMaterials]);

  return (
    <div className="flex flex-col w-full">
      {/* Top Curatorial Banner & Metrics */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-space-xl border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="max-w-2xl space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-semibold">
                Permanent &amp; Seasonal Studio Portfolio
              </span>
            </div>
            <h1 className="font-display text-display text-on-surface tracking-tight">
              Shop Brushspace
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Explore decorative pieces created to bring character to your space. Hand-thrown ceramics, illuminated brass wireworks, and artisan mirror mosaics sculpted for contemplative interiors.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-space-md p-space-md bg-surface-container rounded-xl shadow-sm self-start md:self-auto border border-outline-variant/15">
            <div className="flex flex-col pr-space-md border-r border-outline-variant/20">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                Archived Items
              </span>
              <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                {products.length} Pieces
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                Active Mediums
              </span>
              <span className="font-headline-sm text-headline-sm font-semibold text-primary">
                {categories.length} Disciplines
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Controls Sticky Bar */}
      <div className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md px-margin-mobile md:px-gutter-desktop py-space-md shadow-sm border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          {/* Top Row: Search & Dropdowns & View Mode */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            {/* Search Field */}
            <div className="relative flex-1 max-w-lg">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vases, trays, decorative trees, mosaic..."
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline pl-11 pr-4 py-2.5 rounded-lg text-body-sm font-body-sm outline-none focus:bg-surface shadow-sm transition-all border border-outline-variant/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Selects Group */}
            <div className="flex flex-wrap items-center gap-space-sm justify-between lg:justify-end">
              {/* Price Filter */}
              <div className="relative">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider py-2.5 pl-3.5 pr-8 rounded-lg outline-none cursor-pointer transition-colors shadow-sm border border-outline-variant/20"
                >
                  <option value="all">All Prices</option>
                  <option value="under-2500">Under ₹2,500</option>
                  <option value="2500-4500">₹2,500 - ₹4,500</option>
                  <option value="4500-plus">₹4,500 &amp; Above</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider py-2.5 pl-3.5 pr-8 rounded-lg outline-none cursor-pointer transition-colors shadow-sm border border-outline-variant/20"
                >
                  <option value="featured">Featured Gallery</option>
                  <option value="newest">Newest Additions</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">
                  sort
                </span>
              </div>

              {/* Grid Density Toggles */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded transition-all ${
                    layoutMode === 'grid'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="4-Column Density"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  onClick={() => setLayoutMode('editorial')}
                  className={`p-1.5 rounded transition-all ${
                    layoutMode === 'editorial'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="2-Column Editorial Spread"
                >
                  <span className="material-symbols-outlined text-[18px]">view_agenda</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-on-secondary-fixed text-surface'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All ({products.filter((p) => p.isActive).length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.isActive && p.category.toLowerCase() === cat.slug.toLowerCase()
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all shrink-0 ${
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                      ? 'bg-on-secondary-fixed text-surface'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Material Attribute Micro-tags */}
          <div className="flex flex-wrap items-center gap-space-xs pt-1">
            <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider mr-1">
              Materials:
            </span>
            {materialsList.map((mat) => {
              const isSelected = selectedMaterials.includes(mat);
              return (
                <button
                  key={mat}
                  onClick={() => toggleMaterial(mat)}
                  className={`px-2.5 py-0.5 rounded text-label-sm font-label-sm transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  {mat}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-0.5 rounded text-label-sm font-label-sm text-tertiary underline uppercase ml-auto font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Exhibition Area */}
      <section className="w-full px-margin-mobile md:px-gutter-desktop py-space-xl">
        <div className="max-w-7xl mx-auto">
          {/* Catalog Counter Bar */}
          <div className="flex items-center justify-between mb-space-lg">
            <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
              Showing {filteredProducts.length} of {products.filter((p) => p.isActive).length} handcrafted objects
            </p>
            <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-widest font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>100% Studio Handmade</span>
            </div>
          </div>

          {/* Product Grid / Editorial view */}
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-surface-container rounded-xl overflow-hidden border border-outline-variant/15 flex flex-col">
                  <div className="w-full aspect-[4/5] bg-surface-container-high"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-surface-variant rounded w-3/4"></div>
                    <div className="h-3 bg-surface-variant/60 rounded w-1/2"></div>
                    <div className="h-4 bg-surface-variant rounded w-1/3 pt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid ${
                layoutMode === 'editorial'
                  ? 'grid-cols-1 md:grid-cols-2 gap-gutter-desktop'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop'
              } transition-all duration-300`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout={layoutMode} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3">
                filter_alt_off
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                No matching pieces found
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
                We couldn&apos;t find any objects matching your active filters. Try resetting the filters or searching for another material.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
