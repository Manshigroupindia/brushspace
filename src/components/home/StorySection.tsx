import React from 'react';
import { Link } from 'react-router-dom';

export const StorySection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop py-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
        {/* Left: Dual Visuals */}
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md border border-outline-variant/15">
            <img
              className="w-full h-full object-cover"
              alt="Artisan ceramic craftsperson in sunlit pottery atelier shaping a large earthen vase on a wooden workbench"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV8XNqczmdafM9cR0Yqs21wyX6XCY4q34oMdDshb1618UfMX12IRtGSWVCicdWCXyCKmVomWR32a1nVNnFcfI63lhW8TDcxqPLzZ-XNFcLSCpQ-eWHAD0udc2o8qD-TDRBR9DlO_1TmSEaARPM7rUGnvL96a1eZNz4fx09PzxPZgnKzv-BrQ71HSrEBwVhXBHOuRJgE9qVC4Qw5MdJkUGrZWXulcsSuKrltcw5VQhXes57ikcD2tDK"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-1/2 aspect-square rounded-xl overflow-hidden shadow-xl hidden sm:block bg-surface-container-high border-2 border-surface">
            <img
              className="w-full h-full object-cover"
              alt="Close up of artisan hands carefully weaving fine gold wire around sparkling crystal beads"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByL7hrmCQbJHndIIe7Nds7qs5xeBIMGrjXicL9sDx-lcc6pyzf_Eh4R-LXgNDgVzqY7CB7upCqrJQVPhnk7ZX8ftOCwkMthAwBYh1IQbvqMppS09NAWY01EpjBzfGenK2i-sCGkS5cYofVCS3gPw9MTewtk6dYCom6fYT_zcCy05o2mWnu-vgXq0BDMM7HPRue0FyJ3glSFv1JGgQQhN3fO0A7kXYSZEOTexWswh8pdbMHRg8VCxLh"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right: Atelier Philosophy Narrative */}
        <div className="lg:col-span-6 lg:pl-8 mt-10 lg:mt-0">
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 font-semibold">
            Our Atelier Philosophy
          </p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
            Objects With A Little More Character.
          </h2>
          <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <p>
              Brushspace brings together creativity, decorative design, and beautiful objects for modern spaces. Every piece is curated to evoke warmth, turning everyday corners into personal galleries.
            </p>
            <p>
              We reject the disposable sameness of mass production. Instead, our craftspeople work with honest materials—earthen terracotta, unlacquered metals, and light-capturing glass—celebrating the human hand in every organic curve and subtle variation.
            </p>
          </div>
          <div className="pt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-widest rounded-lg transition-colors border border-outline-variant/20"
            >
              DISCOVER BRUSHSPACE{' '}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
