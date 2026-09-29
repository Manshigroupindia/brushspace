import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { recordOrderInquiry } from '../../utils/whatsapp';

export const SpotlightSection: React.FC = () => {
  const { settings } = useStoreData();

  const handleOrderSpotlight = () => {
    const title = 'Bestseller Dual Set: Mirror Mosaic + Bonsai Gilded Tree';
    const code = 'BS-SPOT-SET';
    const price = 9400;

    recordOrderInquiry(
      [
        {
          productName: title,
          productCode: code,
          price,
          quantity: 1,
        },
      ],
      price
    );

    const message = `Hello, I am interested in ordering this product.

Product: ${title}
Product Code: ${code}
Price: ₹9,400
Quantity: 1
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

Product Link: ${window.location.origin}/#featured-collection

Please share the next steps for placing the order.`;

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop">
        <div className="bg-surface rounded-2xl overflow-hidden shadow-lg p-6 sm:p-10 lg:p-16 border border-outline-variant/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
            {/* Left Column: Narrative & Features */}
            <div className="lg:col-span-5">
              <span className="font-label-md text-label-md text-tertiary uppercase tracking-widest font-semibold">
                Dual Studio Spotlight
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-4">
                Made To Be Noticed.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                When illumination meets meticulous hand-craft. The convergence of mirrored tesserae and sculptural metalwork crafted to transform tranquil daylight into striking evening ambiance.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
                    diamond
                  </span>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">
                      Hand-Applied Rhinestones &amp; Mirror Tiles
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Each prism facet is hand-aligned for continuous multidirectional refraction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
                    landscape
                  </span>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">
                      Organic Terracotta Base
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Kiln-cured unglazed clay offering weighted stability and textural contrast.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
                    light_mode
                  </span>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface">
                      Illuminated LED Battery Option
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Warm discrete underglow engineered for cable-free table styling.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleOrderSpotlight}
                  className="px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
                >
                  ORDER SPOTLIGHT SET • ₹9,400
                </button>
              </div>
            </div>

            {/* Right Column: Dual Spotlight Imagery */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md">
                <img
                  className="w-full h-full object-cover"
                  alt="Intricate macro view of Mirror Mosaic 1 showing hundreds of tiny reflective square mirrors"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZD79vjpLLYtce54pRZBzb2oWcXIIvCAj3ZPyzv9cUcq9C1k0seoaK41ZT7FVr1fnYaPo4TUSKJBPXeDPgMMWWAy6ojW_GDm8m-jtramI1xp03qsidxr-uHZwWVMgIF-wiRfvgWaSS7oLnFZMjpQtK5gK2eZ3oXC1jZQ9AzmkFKvMfACrSNxbcsywkCzUn97te7C7gTyzGNWQlL7srw6_fcIeOCPdHLuC8C1xYTgyTKw4w5tUBMY7t"
                />
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded font-label-sm text-label-sm uppercase tracking-wider text-on-surface shadow-sm">
                  Mirror Mosaic 1
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container shadow-md sm:translate-y-8">
                <img
                  className="w-full h-full object-cover"
                  alt="Close-up of Bonsai 1 Gilded Tree with delicate golden foil leaf attachments"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxMDIUvY5qo6AnaCyCDYBM8afgKv8oJa4-sa_a_Mwqc5fZeX0par9K74ulWYJz-CaGwKTY9afjX1KYvmbweuTotjn5stFwMmEwwWQGg4wfi2VVlI4mABw6QMrJ_FyPed2xxl3X4Lj2Yc1YSHL3FcQWzLzdGa2TxVliavDkdaTjDtbknFdQxdy3tk9Ha_eGrkgiBspYwzPpxvv5gmH6E1zaHjS27HLTpLNBltxcpy7d8ATTlU0fIqDh"
                />
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded font-label-sm text-label-sm uppercase tracking-wider text-on-surface shadow-sm">
                  Bonsai 1 Gilded Tree
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
