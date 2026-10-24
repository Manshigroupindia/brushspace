import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export interface PageItem {
  id: string;
  title: string;
  path: string;
  status: string;
  sections: string;
  description: string;
}

const defaultPages: PageItem[] = [
  { id: 'home', title: 'Home Page', path: '/', status: 'Published', sections: 'Hero, Categories, Featured, Spotlight, Story, FAQs, Social, Newsletter', description: 'Editorial landing page highlighting handcrafted ceramics, seasonal curation, and studio philosophy.' },
  { id: 'shop', title: 'Shop Catalog', path: '/shop', status: 'Published', sections: 'Filtering, 4-Col Grid, 2-Col Editorial, Materials', description: 'Full commerce catalog with craft discipline filtering, materials, and sorting.' },
  { id: 'about', title: 'About Our Story', path: '/about', status: 'Published', sections: 'Atelier Philosophy, Heritage Masters, Spatial Proportion', description: 'Atelier craftsmanship journey, artisan values, and intentional living.' },
  { id: 'contact', title: 'Contact Studio', path: '/contact', status: 'Published', sections: 'Inquiry Form, Showroom Hours, WhatsApp Channel', description: 'Direct contact channels, studio location, and bespoke consultations.' },
  { id: 'faq', title: 'Studio FAQs', path: '/faq', status: 'Published', sections: 'All FAQs, Category Filters', description: 'Customer answers for craft variations, care instructions, and order policies.' },
  { id: 'shipping', title: 'Shipping & Delivery', path: '/shipping-policy', status: 'Published', sections: 'White-Glove Delivery, Wooden Crating, Insurance', description: 'Safe transit, artisan packaging, and white-glove transport guidelines.' },
  { id: 'returns', title: 'Returns & Exchanges', path: '/return-policy', status: 'Published', sections: 'Artisan Exchange Terms, Transit Damage Guarantee', description: 'Handcrafted exchange terms and transit damage replacement policies.' },
  { id: 'privacy', title: 'Privacy Policy', path: '/privacy-policy', status: 'Published', sections: 'Personal Information, Direct WhatsApp Privacy', description: 'Data privacy protocols for direct inquiry and WhatsApp communications.' },
  { id: 'terms', title: 'Terms of Service', path: '/terms', status: 'Published', sections: 'Handcrafted Variations, Studio Terms', description: 'Studio terms, craft variation notices, and sales agreements.' },
];

export const AdminPagesPage: React.FC = () => {
  const { showToast } = useToast();
  const [pages, setPages] = useState<PageItem[]>(() => {
    const saved = localStorage.getItem('brushspace_admin_pages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback to default
      }
    }
    return defaultPages;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [formData, setFormData] = useState<PageItem>({
    id: '',
    title: '',
    path: '',
    status: 'Published',
    sections: '',
    description: '',
  });

  useEffect(() => {
    if (modalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [modalOpen]);

  const openEditModal = (p: PageItem) => {
    setEditingPage(p);
    setFormData({ ...p });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const updated = pages.map((item) => (item.id === formData.id ? { ...formData } : item));
    setPages(updated);
    try {
      localStorage.setItem('brushspace_admin_pages', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    showToast(`Page "${formData.title}" updated successfully.`, 'task_alt');
    setModalOpen(false);
  };

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
                    <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-label-sm uppercase tracking-wider font-semibold ${
                      p.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-surface-container text-outline'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit Page"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <Link
                        to={p.path}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-label-sm text-label-sm uppercase tracking-wider font-semibold"
                        title="Preview Page in New Tab"
                      >
                        <span>Preview</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Page Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-secondary-fixed/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant/20 animate-scaleIn flex flex-col max-h-[90vh] my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-outline-variant/15 flex items-center justify-between shrink-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Edit Page: {editingPage?.title}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                title="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable form content container */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                      Route Path
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Editorial Sections
                  </label>
                  <textarea
                    rows={2}
                    value={formData.sections}
                    onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
                    placeholder="e.g. Hero, Categories, Spotlight..."
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Editorial Overview / SEO Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of page contents and SEO metadata..."
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:px-6 border-t border-outline-variant/15 bg-surface-container-low/50 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-on-secondary-fixed text-surface rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary transition-colors"
                >
                  Update Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
