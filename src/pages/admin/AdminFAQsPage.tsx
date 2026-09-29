import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import type { FAQItem } from '../../types';

export const AdminFAQsPage: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useStoreData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<FAQItem, 'id'>>({
    question: '',
    answer: '',
    category: 'Ordering',
    order: 1,
    isActive: true,
  });

  const openNew = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Ordering',
      order: faqs.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    if (editingId) {
      updateFAQ(editingId, formData);
      showToast('FAQ updated.', 'task_alt');
    } else {
      addFAQ(formData);
      showToast('New FAQ added.', 'task_alt');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, q: string) => {
    if (window.confirm(`Are you sure you want to delete FAQ: "${q}"?`)) {
      try {
        await deleteFAQ(id);
        showToast('FAQ deleted successfully.', 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete FAQ. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Studio FAQs
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Manage inquiries regarding ordering, bespoke dimensions, transit safety, and payment options
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Question
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-surface rounded-xl p-5 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase font-semibold bg-secondary-container text-on-secondary-fixed">
                  {faq.category}
                </span>
                <span className="text-label-sm font-label-sm text-outline">
                  Order #{faq.order}
                </span>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                  faq.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-outline'
                }`}>
                  {faq.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-title-md text-title-md font-semibold text-on-surface mb-1">
                {faq.question}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateFAQ(faq.id, { isActive: !faq.isActive })}
                className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary mr-2"
              >
                {faq.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => openEdit(faq)}
                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                title="Edit FAQ"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={() => handleDelete(faq.id, faq.question)}
                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                title="Delete FAQ"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-secondary-fixed/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/20 animate-scaleIn">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold">
              {editingId ? 'Edit FAQ' : 'New FAQ'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  >
                    <option value="Ordering">Ordering</option>
                    <option value="Payments">Payments</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Products">Products</option>
                    <option value="Customization">Customization</option>
                    <option value="Orders">Orders</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How can I place an order?"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed answer for collectors..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  id="faqActive"
                  className="w-4 h-4 rounded text-primary"
                />
                <label htmlFor="faqActive" className="font-label-sm text-label-sm uppercase tracking-wider font-semibold cursor-pointer">
                  Active in Live FAQ
                </label>
              </div>

              <div className="pt-3 border-t border-outline-variant/15 flex justify-end gap-2">
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
