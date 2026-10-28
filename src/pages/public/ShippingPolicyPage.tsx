import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { RETURN_POLICY, SHIPPING_POLICY } from '../../utils/policyConstants';

export const ShippingPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <SEO
        title="Shipping & Delivery Policy | Brushspace"
        description="Learn about our white-glove packaging, customer-paid courier shipping guidelines, and delivery timelines across India."
        canonical="/shipping-policy"
        type="website"
      />

      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        White-Glove Care &amp; Transit
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-6">
        Shipping &amp; Delivery Policy
      </h1>

      {/* Prominent Shipping Notice Callout */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/25 shadow-sm mb-10 flex flex-col sm:flex-row items-start gap-4">
        <span className="material-symbols-outlined text-[36px] text-primary shrink-0 mt-1">
          local_shipping
        </span>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-widest font-bold">
            {SHIPPING_POLICY.TITLE}
          </span>
          <p className="font-body-md text-body-md text-on-surface font-medium leading-relaxed">
            {SHIPPING_POLICY.NOTICE}
          </p>
        </div>
      </div>

      <div className="space-y-8 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            1. Customer-Paid Shipping Charges
          </h2>
          <p>
            Because each piece created at <strong>BRUSHSPACE</strong> varies significantly in physical weight, volumetric size, and protective crating requirements (from compact metallic wire trees to monumental terracotta urns), shipping charges are not flat-rated or bundled into piece pricing.
          </p>
          <p>
            <strong>How shipping charges are handled:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              When you submit an order enquiry via WhatsApp, our atelier team calculates the courier charges based on your destination pin code, package dimensions, volumetric weight, and chosen courier partner.
            </li>
            <li>
              Final shipping charges are clearly communicated and confirmed with you separately before dispatch.
            </li>
            <li>
              Payment for courier charges is settled together with your final order payment.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            2. Reinforced Shatter-Safe Crating
          </h2>
          <p>
            All ceramic and glass pieces are nested in dense shock-absorbing cushions and placed inside reinforced double-corrugated or wooden outer crates. We include tamper-evident studio security seals on every carton. Protective packaging is provided on a complimentary basis by our atelier.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            3. Transit Timelines
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>In-Studio Stock Pieces:</strong> Prepared and dispatched within 24 to 48 hours of order confirmation. Transit takes 3 to 6 business days across metro cities in India.</li>
            <li><strong>Made-to-Order &amp; Custom Sized Pieces:</strong> Require 5 to 10 days of artisan sculpting, firing, and air-curing before courier dispatch.</li>
          </ul>
        </section>

        {/* Dedicated No Return / Refund Policy Section */}
        <section className="space-y-3 p-6 rounded-2xl bg-surface-container border border-outline-variant/20">
          <div className="flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider font-bold">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <span>4. {RETURN_POLICY.BADGE}</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            {RETURN_POLICY.FULL_TEXT}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            If your shipment shows evidence of transit damage or defects upon unboxing, please contact our team within 24 to 48 hours with photographs or unboxing video so we can promptly review and resolve the issue.
          </p>
          <Link to="/return-policy" className="text-primary font-label-sm text-label-sm uppercase tracking-wider hover:underline inline-flex items-center gap-1 font-semibold pt-1">
            <span>Read Complete Return &amp; Refund Guidelines</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </section>
      </div>
    </div>
  );
};
