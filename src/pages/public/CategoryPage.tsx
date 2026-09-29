import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { ProductCard } from '../../components/product/ProductCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useStoreData();

  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const category = categories.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  useEffect(() => {
    if (category) {
      document.title = `${category.name} — BRUSHSPACE Curated Collection`;
    } else {
      document.title = 'Category — BRUSHSPACE';
    }
    window.scrollTo(0, 0);
  }, [category]);

  const categoryProducts = useMemo(() => {
    if (!slug) return [];
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        // Match category slug or name
        const matchSlug = p.category.toLowerCase() === slug.toLowerCase();
        const matchCatName = category && p.category.toLowerCase() === category.name.toLowerCase();
        return matchSlug || matchCatName;
      })
      .filter((p) => {
        if (selectedPriceRange === 'under-2500') return p.price < 2500;
        if (selectedPriceRange === '2500-4500') return p.price >= 2500 && p.price <= 4500;
        if (selectedPriceRange === '4500-plus') return p.price > 4500;
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-low') return a.price - b.price;
        if (selectedSort === 'price-high') return b.price - a.price;
        if (selectedSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, slug, category, selectedPriceRange, selectedSort]);

  if (!category && categoryProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile py-24 text-center">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Category Not Found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          The curated discipline you are looking for does not exist or has been archived.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const categoryName = category?.name || slug?.replace(/-/g, ' ').toUpperCase();
  const categoryDesc =
    category?.description ||
    'Handcrafted artistic pieces celebrating subtle tactile balance, rich earthy patinas, and modern architectural poise.';
  const categoryImage =
    category?.image ||
    (categoryProducts[0] ? categoryProducts[0].images[0] : 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80');

  return (
    <div className="flex flex-col w-full">
      {/* Category Hero Banner */}
      <section className="relative w-full overflow-hidden bg-surface-container-low border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest mb-4">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="text-outline-variant">/</span>
                <Link to="/shop" className="hover:text-primary transition-colors">Collections</Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">{categoryName}</span>
              </nav>
              {category?.badge && (
                <span className="inline-block bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 rounded-full mb-3 font-semibold">
                  {category.badge}
                </span>
              )}
              <h1 className="font-display text-display text-on-surface tracking-tight mb-4">
                {categoryName}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                {categoryDesc}
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/20">
                <img
                  src={categoryImage}
                  alt={categoryName}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Strip */}
      <div className="w-full bg-surface border-b border-outline-variant/15 px-margin-mobile md:px-gutter-desktop py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
            {categoryProducts.length} Objects Available
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer border border-outline-variant/20 shadow-sm"
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
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer border border-outline-variant/20 shadow-sm"
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
          </div>
        </div>
      </div>

      {/* Category Products Grid */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-headline-sm text-headline-sm text-on-surface">No pieces match current price filters.</p>
            <button
              onClick={() => setSelectedPriceRange('all')}
              className="mt-4 px-6 py-2 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Reset Price Filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
