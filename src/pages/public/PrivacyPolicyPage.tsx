import React, { useEffect } from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-desktop py-16">
      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-2">
        Legal &amp; Transparency
      </span>
      <h1 className="font-display text-display text-on-surface tracking-tight mb-8">
        Privacy Policy
      </h1>

      <div className="space-y-6 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        <p>
          At <strong>BRUSHSPACE</strong>, accessible from our online catalog and studio channels, we regard the privacy of our collectors and visitors as paramount. This Privacy Policy details the types of personal information that is gathered and recorded by BRUSHSPACE and how we utilize it.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          1. Information We Collect
        </h2>
        <p>
          When you initiate an inquiry via WhatsApp, submit a contact request, or save items to your curated bag, we may collect your name, email address, phone number, and delivery city solely for the purpose of processing your direct order and coordinating shipment.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          2. Direct WhatsApp Communication
        </h2>
        <p>
          We do not charge customer payments through automated digital checkouts on this website. All order verifications and coordination occur directly between you and our verified studio managers via WhatsApp or secure payment links. We never sell, lease, or share your contact details with external commercial marketers.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          3. Local Device Storage
        </h2>
        <p>
          Our application stores your Curated Bag and Wishlist preferences within your browser’s local storage to ensure your selections persist between visits. No sensitive financial information is ever stored.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-4">
          4. Contact Us
        </h2>
        <p>
          If you have questions about our data practices or wish to review stored inquiries, please email us directly at{' '}
          <a href="mailto:contact@brushspace.com" className="text-primary underline">
            contact@brushspace.com
          </a>.
        </p>
      </div>
    </div>
  );
};
