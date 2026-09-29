import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import type { Testimonial } from '../../types';
import { uploadImage } from '../../services/cloudinary';

export const AdminTestimonialsPage: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStoreData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({
    name: '',
    location: '',
    rating: 5,
    review: '',
    image: '',
    featured: true,
    verified: true,
    isActive: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    showToast('Uploading testimonial photo to Cloudinary...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/testimonials');
      setFormData((prev) => ({ ...prev, image: res.secureUrl }));
      showToast('Photo uploaded.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: 'Mumbai',
      rating: 5,
      review: '',
      featured: true,
      verified: true,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      location: t.location,
      rating: t.rating,
      review: t.review,
      featured: t.featured,
      verified: t.verified,
      isActive: t.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review) return;

    if (editingId) {
      updateTestimonial(editingId, formData);
      showToast('Testimonial updated.', 'task_alt');
    } else {
      addTestimonial(formData);
      showToast('New testimonial created.', 'task_alt');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete review from "${name}"?`)) {
      try {
        await deleteTestimonial(id);
        showToast('Testimonial deleted successfully.', 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete testimonial. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Collector Reflections
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Manage customer feedback, verified ratings, and homepage featured reviews
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-surface rounded-xl p-5 border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-primary">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px] material-symbols-fill">
                      star
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {t.featured && (
                    <span className="bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded text-[10px] font-label-sm uppercase font-semibold">
                      Featured
                    </span>
                  )}
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                    t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-outline'
                  }`}>
                    {t.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant italic mb-4 leading-relaxed">
                &ldquo;{t.review}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
              <div>
                <p className="font-title-md text-title-md font-semibold text-on-surface">{t.name}</p>
                <p className="text-[11px] text-outline">{t.location}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-secondary-fixed/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/20 animate-scaleIn">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold">
              {editingId ? 'Edit Testimonial' : 'New Collector Reflection'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Customer Review *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                    Client Photo / Interior Setup (Cloudinary)
                  </label>
                  <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-mono text-[12px] outline-none mb-2"
                />
                {formData.image && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant/20 bg-surface-container">
                    <img src={formData.image} alt="Reviewer" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    Featured
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    Active
                  </span>
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
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
