import React, { useEffect } from 'react';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        Studio Regulations
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-8">
        Terms of Service
      </h1>

      <div className="space-y-6 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          Welcome to <strong>BRUSHSPACE</strong>. By exploring our catalog and purchasing our handcrafted decorative pieces, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          1. Handcrafted Variations
        </h2>
        <p>
          All BRUSHSPACE vessels, bonsai trees, mosaic spheres, and trays are individually wheel-thrown, hand-embellished, or wire-sculpted. Natural subtleties in glaze texture, clay grain, gold foil patina, and dimensions (within ±1-2 cm) are deliberate signatures of authentic studio handcraft, not defects.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          2. Direct Studio Orders &amp; Invoicing
        </h2>
        <p>
          Orders initiated via our website’s &ldquo;BUY NOW&rdquo; action connect you to our studio via WhatsApp. An order is formally confirmed once our studio manager confirms batch availability and payment has been received via our official merchant payment link or bank transfer.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          3. Intellectual Property
        </h2>
        <p>
          All imagery, product sculpts, trademarks, and curatorial editorial descriptions remain the exclusive intellectual property of BRUSHSPACE. Commercial replication without written consent is strictly prohibited.
        </p>
      </div>
    </div>
  );
};
