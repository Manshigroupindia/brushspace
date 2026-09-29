import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useStoreData } from '../../context/StoreDataContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStoreData();
  const activeCategories = categories.filter((c) => c.isActive).slice(0, 6);

  return (
    <footer className="w-full bg-surface-container-low text-on-surface pt-space-xl pb-space-lg border-t border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop mb-space-xl">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col space-y-space-md">
            <Logo />
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Curated decorative objects bringing art, warmth and character into modern living spaces. Handcrafted in limited batches by heritage artisans.
            </p>
            <div className="pt-2 flex items-center gap-space-sm">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Handcrafted Studio
              </span>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface mb-space-md font-semibold">
              Collections
            </h3>
            <ul className="space-y-space-sm">
              {activeCategories.length > 0 ? (
                activeCategories.map((c) => (
                  <li key={c.id} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                    <Link to={`/category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))
              ) : (
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  <Link to="/shop">All Collections</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface mb-space-md font-semibold">
              Customer Care
            </h3>
            <ul className="space-y-space-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/about">About Our Story</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/contact">Contact Studio</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/shipping-policy">Shipping &amp; Delivery</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/return-policy">Returns &amp; Exchanges</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/faq">FAQs</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Connect */}
          <div>
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface mb-space-md font-semibold">
              Studio Connect
            </h3>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello BRUSHSPACE Atelier, I would like to inquire about your collections.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-space-xs hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">chat</span>
                Direct WhatsApp ordering inquiry
              </a>
              <p className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-tertiary">mail</span>
                <a className="hover:text-primary transition-colors" href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-tertiary">location_on</span>
                {settings.showroomAddress}
              </p>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center gap-space-md">
              <a
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                href={settings.socialPinterest}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">push_pin</span>
              </a>
              <a
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-md mt-space-md bg-surface-container/50 -mx-margin-mobile md:-mx-gutter-desktop px-margin-mobile md:px-gutter-desktop py-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left rounded-lg">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} BRUSHSPACE Home Décor. All rights reserved. Handcrafted artistic living.
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant/80 uppercase tracking-widest">
            Architectural Minimalist Luxury
          </p>
        </div>
      </div>
    </footer>
  );
};
