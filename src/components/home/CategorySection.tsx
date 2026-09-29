import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';

export const CategorySection: React.FC = () => {
  const { categories } = useStoreData();
  const activeCategories = categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl" id="category-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            Curation by Medium
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Shop By Discipline &amp; Form
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-4 md:mt-0 leading-relaxed">
          Distinct material explorations spanning terracotta, spun wire, reflective mosaic tesserae, and natural botanical structures.
        </p>
      </div>

      {activeCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {activeCategories.map((cat) => (
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
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors font-medium">
                    {cat.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  Explore Category{' '}
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-on-surface-variant font-body-md bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
          No disciplines currently listed.
        </div>
      )}
    </section>
  );
};
