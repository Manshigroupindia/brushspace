import React, { useEffect } from 'react';
import { SEO } from '../../components/common/SEO';
import { RETURN_POLICY, SHIPPING_POLICY } from '../../utils/policyConstants';

export const ReturnPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <SEO
        title="No Return, No Refund & No Exchange Policy | Brushspace"
        description="Review our professional No Return, No Refund and No Exchange policy for handcrafted studio objects, subject to applicable law."
        canonical="/return-policy"
        type="website"
      />

      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        Studio Policy &amp; Terms
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-6">
        Return &amp; Refund Policy
      </h1>

      {/* Prominent Policy Badge Callout */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/25 shadow-sm mb-10 flex flex-col sm:flex-row items-start gap-4">
        <span className="material-symbols-outlined text-[36px] text-primary shrink-0 mt-1">
          verified_user
        </span>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded bg-primary text-surface font-label-md text-label-md uppercase tracking-widest font-bold">
            {RETURN_POLICY.BADGE}
          </span>
          <p className="font-body-md text-body-md text-on-surface font-medium leading-relaxed">
            {RETURN_POLICY.FULL_TEXT}
          </p>
        </div>
      </div>

      <div className="space-y-8 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            1. No Return, No Refund and No Exchange Policy
          </h2>
          <p>
            At <strong>BRUSHSPACE</strong>, our pieces are individually handcrafted, hand-painted, and sculpted by skilled artisans using fragile natural clay, terracotta, metal wire, and glass mosaic mediums. Each finished piece represents hours of dedicated craftsmanship.
          </p>
          <p>
            Due to the delicate nature and bespoke batch production of our home décor pieces, we maintain a strict <strong>No Return, No Refund, and No Exchange</strong> policy on all completed purchases once dispatched from our atelier, except where a different outcome is explicitly mandated by applicable statutory consumer protection laws.
          </p>
          <p>
            We urge all patrons and collectors to carefully review all product dimensions, materials, care requirements, and color specifications prior to confirming an order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            2. Damaged, Defective or Incorrect Deliveries
          </h2>
          <p>
            We take extreme pride in our protective packaging standards. However, if your order arrives damaged during courier transit, has a manufacturing defect, or if an incorrect item was delivered:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Prompt Notification:</strong> Please contact our atelier team within <strong>24 to 48 hours</strong> of receipt via WhatsApp or email.
            </li>
            <li>
              <strong>Verification Documentation:</strong> Provide clear unboxing photographs or video showing the exterior courier packaging, the shipping label, and the specific damage or defect on the piece.
            </li>
            <li>
              <strong>Studio Review &amp; Resolution:</strong> Once reviewed and verified by our studio curators, we will promptly coordinate an appropriate resolution, such as dispatching a replacement piece or resolving the issue in accordance with applicable consumer protection laws.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            3. Shipping Charges Notice
          </h2>
          <p>
            {SHIPPING_POLICY.NOTICE}
          </p>
          <p>
            Shipping fees are non-refundable in instances of rejected deliveries, incorrect recipient addresses provided by the customer, or failed delivery attempts by the courier service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            4. Statutory Consumer Rights
          </h2>
          <p>
            Nothing in this policy is intended to exclude, limit, or restrict any statutory rights or guarantees provided to consumers under applicable Indian consumer protection laws. All claims are assessed and resolved fairly and in good faith.
          </p>
        </section>

        <section className="pt-6 border-t border-outline-variant/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">Questions Regarding An Order?</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Our concierge team is available to assist you Monday through Saturday.</p>
          </div>
          <a
            href="https://wa.me/919876543210?text=Hello%20Brushspace%20Atelier,%20I%20have%20an%20inquiry%20regarding%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Contact Studio Concierge</span>
          </a>
        </section>
      </div>
    </div>
  );
};
