import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useStoreData();
  const activeTestimonials = testimonials.filter((t) => t.isActive);

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
          Collector Reflections
        </p>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          What Our Customers Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {activeTestimonials.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between border border-outline-variant/15 transition-all duration-300 hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-1 text-primary mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px] material-symbols-fill"
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface italic mb-4 font-normal leading-relaxed">
                &ldquo;{item.review}&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant/15 flex items-center justify-between">
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">{item.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {item.location} • Verified Collector
                </p>
              </div>
              {item.verified && (
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
