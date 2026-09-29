import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';

export const Hero: React.FC = () => {
  const { banners } = useStoreData();
  const heroBanner = banners.find((b) => b.type === 'hero' && b.isActive) || banners[0];

  return (
    <section className="relative w-full overflow-hidden bg-surface-container-low border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          {/* Hero Text Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 bg-secondary-container px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-secondary-fixed font-semibold">
                {heroBanner?.badge || 'Crafted in Limited Batches • Direct Artisan Studio'}
              </span>
            </div>

            <h1 className="font-display text-display tracking-tight text-on-surface mb-6">
              {heroBanner?.title || 'Bring Art Into Your Space.'}
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              {heroBanner?.subtitle ||
                'Discover artistic decorative pieces designed to add warmth, character, and quiet beauty to every architectural corner of your home.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                to={heroBanner?.buttonUrl || '/shop'}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-sm"
              >
                {heroBanner?.buttonText || 'SHOP COLLECTION'}
              </Link>
              <Link
                to="/category/vases"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-all duration-300 border border-outline-variant/20"
              >
                EXPLORE VASES
              </Link>
            </div>

            {/* Editorial Metas */}
            <div className="mt-12 pt-8 w-full grid grid-cols-3 gap-4 border-t-0 bg-surface-container/60 p-4 rounded-xl border border-outline-variant/15">
              <div>
                <p className="font-display text-headline-sm text-primary font-semibold">100%</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Handcrafted
                </p>
              </div>
              <div>
                <p className="font-display text-headline-sm text-on-surface font-semibold">500+</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Homes Curated
                </p>
              </div>
              <div>
                <p className="font-display text-headline-sm text-tertiary font-semibold">Pan-India</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                  White Glove Care
                </p>
              </div>
            </div>
          </div>

          {/* Hero Editorial Collage (Asymmetrical) */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container border border-outline-variant/20">
              <img
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Modern architectural interior gallery alcove with lime wash textured plaster walls, organic ceramic vessels, terracotta vases on pedestal"
                src={
                  heroBanner?.image ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTyoy9OIFKK1X3d0X_jrW7H_rn9NlBkveEQB6XjR_D9Ijm0888jLYyax75ZUjYqWCIBn22zmjmVe3EjL7-x9OGp53QAzHcKNM1Vfnov6E8MjlBVaObDD7pj4zST-AMXXrDuMEwGFCfMdkj91h4Imjj3yrKsMybeDtQBHh7mOLGIqoutbbG14v7V_2-yfWob7C908M4ccDjz2OBY32tpW2N3Z3lLusiTLXzm2PUNjIsYaW4ELzhF-gw'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/50 via-transparent to-transparent"></div>
              <Link
                to="/product/owl-black-golden-leaves-sculptural-vase"
                className="absolute bottom-6 left-6 right-6 p-4 bg-surface/90 backdrop-blur-md rounded-lg flex items-center justify-between border border-outline-variant/30 hover:bg-surface transition-colors group"
              >
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                    Exhibition No. 04
                  </p>
                  <p className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    Atelier Terra &amp; Leaf Series
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Secondary floating architectural tile */}
            <div className="hidden sm:block absolute -bottom-8 -left-10 w-48 h-56 rounded-xl overflow-hidden shadow-2xl bg-surface-container-high border-2 border-surface">
              <img
                className="w-full h-full object-cover"
                alt="Macro close-up shot of hand-textured terracotta and rustic sand glaze on an art vessel with delicate brass leaf detailing"
                src={
                  heroBanner?.secondaryImage ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDx29is2f-o2jOJGCD3vstgrqhGOIFy_NcjAL1ZwRLc94o4YI13jorBIh8GGuAmABXU50m2Cn0yei45sMAcqwBKR2DBMnhqMTWuCvqQFvdbnAU14MrQYaUyVXIBAes6h-7ZgviGHEQ8PcZCtxxY25o67HP73AYnYsFAKPLUfezrTcH1mltr1Cvkz3xCTrXY2DBuPP-3qSZmdAtas3-bkDtT1aEzIdgL0ZzkLfofTLGyOzgXQEDPBp9U'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
