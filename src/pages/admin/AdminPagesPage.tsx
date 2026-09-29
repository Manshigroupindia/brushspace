import React from 'react';
import { Link } from 'react-router-dom';

export const AdminPagesPage: React.FC = () => {
  const pages = [
    { title: 'Home Page', path: '/', status: 'Published', sections: 'Hero, Categories, Featured, Spotlight, Story, FAQs, Social, Newsletter' },
    { title: 'Shop Catalog', path: '/shop', status: 'Published', sections: 'Filtering, 4-Col Grid, 2-Col Editorial, Materials' },
    { title: 'About Our Story', path: '/about', status: 'Published', sections: 'Atelier Philosophy, Heritage Masters, Spatial Proportion' },
    { title: 'Contact Studio', path: '/contact', status: 'Published', sections: 'Inquiry Form, Showroom Hours, WhatsApp Channel' },
    { title: 'Studio FAQs', path: '/faq', status: 'Published', sections: 'All FAQs, Category Filters' },
    { title: 'Shipping & Delivery', path: '/shipping-policy', status: 'Published', sections: 'White-Glove Delivery, Wooden Crating, Insurance' },
    { title: 'Returns & Exchanges', path: '/return-policy', status: 'Published', sections: 'Artisan Exchange Terms, Transit Damage Guarantee' },
    { title: 'Privacy Policy', path: '/privacy-policy', status: 'Published', sections: 'Personal Information, Direct WhatsApp Privacy' },
    { title: 'Terms of Service', path: '/terms', status: 'Published', sections: 'Handcrafted Variations, Studio Terms' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
          Site Pages &amp; Editorial Content
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Overview of customer-facing storefront pages and their active editorial sections
        </p>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3 px-4">Page Title</th>
                <th className="py-3 px-4">Route Path</th>
                <th className="py-3 px-4">Sections</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {pages.map((p) => (
                <tr key={p.path} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {p.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[12px] text-primary">
                    {p.path}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-[12px] max-w-xs truncate">
                    {p.sections}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={p.path}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-label-sm text-label-sm uppercase tracking-wider font-semibold"
                    >
                      <span>Preview</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
