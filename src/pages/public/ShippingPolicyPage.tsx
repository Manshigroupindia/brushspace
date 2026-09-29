import React, { useEffect } from 'react';

export const ShippingPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Shipping & Delivery Policy — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        White-Glove Care
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-8">
        Shipping &amp; Delivery Policy
      </h1>

      <div className="space-y-6 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          At <strong>BRUSHSPACE</strong>, each delicate ceramic vase, wire bonsai sculpture, and mirror mosaic piece requires white-glove packaging to ensure arrival in pristine museum exhibition condition.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          1. Reinforced Shatter-Safe Crating
        </h2>
        <p>
          All ceramic and glass pieces are nested in dense, biodegradable shock-absorbing foam cushions and placed inside reinforced double-corrugated or wooden outer crates. We include tamper-evident studio security seals.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          2. Transit Timelines
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>In-Stock Pieces:</strong> Dispatched within 24 to 48 hours. Delivery takes 3 to 5 business days across metro cities in India.</li>
          <li><strong>Made-to-Order &amp; Custom Pieces:</strong> Require 5 to 10 days of artisan sculpting, firing, and air-curing before dispatch.</li>
        </ul>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          3. Shipping Charges
        </h2>
        <p>
          We provide <strong>Complimentary Studio White-Glove Shipping</strong> on all orders exceeding ₹5,000 pan-India. For orders below this threshold, a flat delivery fee of ₹350 applies.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          4. 100% Transit Insurance
        </h2>
        <p>
          Every shipment is fully insured by our atelier until handed over to your doorstep. In the rare event of transit damage, we provide immediate free replacement upon photographic unboxing verification within 24 hours.
        </p>
      </div>
    </div>
  );
};
