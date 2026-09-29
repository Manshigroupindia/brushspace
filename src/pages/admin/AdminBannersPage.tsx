import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import type { Banner } from '../../types';
import { uploadImage } from '../../services/cloudinary';

export const AdminBannersPage: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useStoreData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);

  const [formData, setFormData] = useState<Omit<Banner, 'id'>>({
    type: 'hero',
    title: '',
    subtitle: '',
    badge: '',
    buttonText: 'SHOP COLLECTION',
    buttonUrl: '/shop',
    image: '',
    secondaryImage: '',
    isActive: true,
  });

  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPrimary(true);
    showToast('Uploading primary banner image...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/banners');
      setFormData((prev) => ({ ...prev, image: res.secureUrl }));
      showToast('Primary banner uploaded.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingPrimary(false);
      e.target.value = '';
    }
  };

  const handleSecondaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSecondary(true);
    showToast('Uploading secondary banner image...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/banners');
      setFormData((prev) => ({ ...prev, secondaryImage: res.secureUrl }));
      showToast('Secondary banner uploaded.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploadingSecondary(false);
      e.target.value = '';
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({
      type: 'hero',
      title: '',
      subtitle: '',
      badge: 'Limited Batch Drop',
      buttonText: 'EXPLORE PIECES',
      buttonUrl: '/shop',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingId(b.id);
    setFormData({
      type: b.type,
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge || '',
      buttonText: b.buttonText,
      buttonUrl: b.buttonUrl,
      image: b.image,
      secondaryImage: b.secondaryImage || '',
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      updateBanner(editingId, formData);
      showToast('Banner updated.', 'task_alt');
    } else {
      addBanner(formData);
      showToast('New showcase banner added.', 'task_alt');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      try {
        await deleteBanner(id);
        showToast('Banner deleted successfully.', 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete banner. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Banners &amp; Showcases
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Manage homepage editorial banners, dual spotlights, promotional drops, and popup announcements
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-surface rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-surface-container overflow-hidden">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-on-secondary-fixed/90 text-surface text-[10px] font-label-sm uppercase tracking-wider px-2 py-0.5 rounded">
                  {banner.type.toUpperCase()}
                </span>
                <span className={`absolute top-2 right-2 text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                  banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface/80 text-outline'
                }`}>
                  {banner.isActive ? 'Active' : 'Draft'}
                </span>
              </div>

              <div className="p-5">
                {banner.badge && (
                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold mb-1">
                    {banner.badge}
                  </p>
                )}
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-2">
                  {banner.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                  {banner.subtitle}
                </p>
                <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline">
                  <span>Button: {banner.buttonText}</span>
                  <span>•</span>
                  <span>Link: {banner.buttonUrl}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
              <button
                onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary"
              >
                {banner.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(banner)}
                  className="p-1.5 rounded hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(banner.id, banner.title)}
                  className="p-1.5 rounded hover:bg-surface text-on-surface-variant hover:text-error transition-colors"
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
              {editingId ? 'Edit Banner' : 'Create Banner'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Banner Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  >
                    <option value="hero">Hero Banner</option>
                    <option value="promo">Promotional Spotlight</option>
                    <option value="category">Category Header</option>
                    <option value="popup">Announcement Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Crafted in Limited Batches"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bring Art Into Your Space."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                    Primary Banner Image (Cloudinary)
                  </label>
                  <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploadingPrimary ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    <span>{isUploadingPrimary ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePrimaryUpload}
                      disabled={isUploadingPrimary}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono text-[12px] outline-none mb-2"
                />
                {formData.image && (
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container mb-2">
                    <img src={formData.image} alt="Primary Banner" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                    Secondary Collage Image URL (Optional)
                  </label>
                  <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploadingSecondary ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    <span>{isUploadingSecondary ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSecondaryUpload}
                      disabled={isUploadingSecondary}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.secondaryImage}
                  onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono text-[12px] outline-none mb-2"
                />
                {formData.secondaryImage && (
                  <div className="relative w-28 aspect-square rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container">
                    <img src={formData.secondaryImage} alt="Secondary Banner" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  id="banActive"
                  className="w-4 h-4 rounded text-primary"
                />
                <label htmlFor="banActive" className="font-label-sm text-label-sm uppercase tracking-wider font-semibold cursor-pointer">
                  Active
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
