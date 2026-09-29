import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Our Atelier — BRUSHSPACE Story & Philosophy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-surface-container-low px-margin-mobile md:px-gutter-desktop py-16 md:py-24 border-b border-outline-variant/15">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
            The Atelier Narrative
          </span>
          <h1 className="font-display text-display text-on-surface tracking-tight mb-6">
            Objects With A Little More Character.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Brushspace brings together creativity, decorative design, and beautiful objects for modern spaces. Every piece is curated to evoke warmth, turning everyday corners into personal galleries.
          </p>
        </div>
      </section>

      {/* Main Philosophy Section */}
      <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center mb-16">
          <div className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md border border-outline-variant/15">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV8XNqczmdafM9cR0Yqs21wyX6XCY4q34oMdDshb1618UfMX12IRtGSWVCicdWCXyCKmVomWR32a1nVNnFcfI63lhW8TDcxqPLzZ-XNFcLSCpQ-eWHAD0udc2o8qD-TDRBR9DlO_1TmSEaARPM7rUGnvL96a1eZNz4fx09PzxPZgnKzv-BrQ71HSrEBwVhXBHOuRJgE9qVC4Qw5MdJkUGrZWXulcsSuKrltcw5VQhXes57ikcD2tDK"
              alt="Pottery artisan studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Against the Grain of Mass Production
            </h2>
            <p>
              In a digital world overflowing with uniform, plastic commodities, Brushspace was born from a desire for tactile permanence. We celebrate the marks of human labor—the gentle wobble of wheel-thrown clay, the uneven facets of hand-cleaved mirrors, and the organic curves of spun wire branches.
            </p>
            <p>
              Each vase, tray, and bonsai tree in our collection is crafted in deliberately limited batches across master studios in Khurja, Jaipur, and Moradabad. Rather than chasing transient trends, we focus on timeless forms that ground an interior with quiet presence.
            </p>
          </div>
        </div>

        {/* 3 Values Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-[32px] text-primary mb-4">palette</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium">Honest Earth Materials</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              We work exclusively with unadulterated terracotta, solid stone composites, unlacquered brass, and light-capturing glass prism bevels.
            </p>
          </div>
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-[32px] text-primary mb-4">handyman</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium">Patience in Craft</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              No shortcuts. Multiple kiln firings, days of natural air-curing, and hand-adhered metallic foil create depth that machines cannot replicate.
            </p>
          </div>
          <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-[32px] text-primary mb-4">home_pin</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium">Architectural Proportion</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Scaled deliberately for modern domestic spaces: architectural niches, low oak credenzas, reading mantels, and centered dining tables.
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
          >
            DISCOVER OUR PIECES
          </Link>
        </div>
      </section>
    </div>
  );
};
