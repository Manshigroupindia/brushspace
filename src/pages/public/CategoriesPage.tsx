import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, isLoading } = useStoreData();

  useEffect(() => {
    document.title = 'Disciplines & Mediums — BRUSHSPACE Categories';
    window.scrollTo(0, 0);
  }, []);

  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="w-full flex flex-col">
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-10 md:py-14 border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-semibold">
                Curation By Discipline
              </span>
            </div>
            <h1 className="font-display text-headline-lg md:text-display text-on-surface tracking-tight">
              Design Categories
            </h1>
            <p className="font-body-md md:font-body-lg text-on-surface-variant max-w-xl mt-2 leading-relaxed">
              Explore decorative pieces organized by artisan medium, form, and architectural expression—from sculptural terracotta to gilded wirecraft and kinetic mirror mosaic.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-widest bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/15">
            <span className="material-symbols-outlined text-[18px] text-primary">category</span>
            <span>{activeCategories.length} Disciplines Curated</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-gutter-desktop py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading && activeCategories.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-container rounded-xl overflow-hidden border border-outline-variant/15 flex flex-col">
                <div className="w-full aspect-[4/3] bg-surface-container-high"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-surface-variant rounded w-1/2"></div>
                  <div className="h-3 bg-surface-variant/60 rounded w-full"></div>
                  <div className="h-3 bg-surface-variant/60 rounded w-4/5"></div>
                </div>
              </div>
            ))
          ) : (
            activeCategories.map((cat) => {
              const count = products.filter(
                (p) =>
                  p.isActive &&
                  (p.category.toLowerCase() === cat.slug.toLowerCase() ||
                    p.category.toLowerCase() === cat.name.toLowerCase())
              ).length;

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-outline-variant/15"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {cat.badge && (
                      <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider text-on-surface shadow-sm">
                        {cat.badge}
                      </div>
                    )}
                    {count > 0 && (
                      <div className="absolute bottom-3 right-3 bg-on-secondary-fixed/80 text-surface backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide">
                        {count} {count === 1 ? 'piece' : 'pieces'}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors font-medium">
                        {cat.name}
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                      Explore Discipline{' '}
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
