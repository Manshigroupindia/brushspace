import React, { useEffect } from 'react';

export const ReturnPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Returns & Exchanges Policy — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        Collector Protection
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-8">
        Returns &amp; Exchanges
      </h1>

      <div className="space-y-6 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          We want you to be completely delighted with your acquisitions. Because our pieces are fragile studio ceramics and handmade wire art, please review our exchange guidelines below.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          1. Transit Damage or Defects
        </h2>
        <p>
          If your piece arrives damaged or defective in any way, please notify our studio team via WhatsApp or email within <strong>24 hours</strong> of delivery with photos or video of the packaging and object. We will arrange a courier pickup and dispatch an identical replacement or issue a full refund immediately at no additional cost.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          2. Size &amp; Style Exchanges
        </h2>
        <p>
          If a vessel or tray does not fit the intended proportion of your room, you may request an exchange for another studio piece within <strong>7 days</strong> of delivery, provided the item is unused and kept in its original protective packaging.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          3. Made to Order &amp; Custom Sized Pieces
        </h2>
        <p>
          Due to the individualized studio sculpting time involved, bespoke commissions and custom-sized vessels cannot be returned unless transit damage has occurred.
        </p>
      </div>
    </div>
  );
};
