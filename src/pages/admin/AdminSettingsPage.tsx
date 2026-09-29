import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { uploadImage } from '../../services/cloudinary';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, runOneClickMigration } = useStoreData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    showToast('Uploading brand logo to Cloudinary...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/site');
      setFormData((prev) => ({ ...prev, logoUrl: res.secureUrl }));
      showToast('Brand logo uploaded.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Logo upload failed', 'error');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFavicon(true);
    showToast('Uploading favicon to Cloudinary...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/site');
      setFormData((prev) => ({ ...prev, faviconUrl: res.secureUrl }));
      showToast('Favicon uploaded.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Favicon upload failed', 'error');
    } finally {
      setIsUploadingFavicon(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      showToast('Store settings saved successfully to Firestore.', 'task_alt');
    } catch (err: any) {
      showToast('Failed to save settings: ' + err.message, 'error');
    }
  };

  const handleRunMigration = async () => {
    if (!window.confirm('Sync and push all 28 Brushspace products, categories, banners, testimonials, and FAQs directly to Firestore?')) {
      return;
    }
    setIsMigrating(true);
    showToast('Starting Firestore data synchronization...', 'sync');
    try {
      const res = await runOneClickMigration();
      if (res.success) {
        showToast(`Successfully synchronized ${res.count} records to Cloud Firestore!`, 'task_alt');
      } else {
        showToast('Synchronization error: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Migration failed: ' + err.message, 'error');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
          Studio Atelier Settings
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Configure centralized WhatsApp order dispatch number, announcement text, contact points, and branding
        </p>
      </div>

      {/* Cloud Sync & Migration Card */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[22px]">database</span>
            <h3 className="font-title-md text-title-md font-semibold text-on-surface">
              Cloud Firestore &amp; Cloudinary Sync
            </h3>
          </div>
          <p className="text-body-sm text-on-surface-variant max-w-xl">
            Push all 28 original handcrafted Brushspace products, categories, banners, testimonials, and site settings directly into your live Firestore database using your authenticated admin credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunMigration}
          disabled={isMigrating}
          className="shrink-0 px-6 py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isMigrating ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
              <span>Syncing Data...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
              <span>Sync to Firestore</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Centralized WhatsApp Ordering Settings */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[24px]">chat</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Direct WhatsApp Dispatch Configuration
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            All customer &ldquo;BUY NOW&rdquo; clicks on individual products and the multi-item cart transmit inquiries to this single seller WhatsApp number.
          </p>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              WhatsApp Seller Number (with country code, digits only) *
            </label>
            <input
              type="text"
              required
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="e.g. 919876543210"
              className="w-full bg-surface-container-low px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono outline-none focus:border-primary shadow-sm"
            />
            <p className="font-label-sm text-label-sm text-outline mt-1">
              Currently routed to: +{formData.whatsappNumber}
            </p>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">campaign</span>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Announcement Bar
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isAnnouncementBarActive"
                checked={formData.isAnnouncementBarActive}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded text-primary"
              />
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Show on Public Store
              </span>
            </label>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Bar Text
            </label>
            <input
              type="text"
              name="announcementBarText"
              value={formData.announcementBarText}
              onChange={handleChange}
              className="w-full bg-surface-container-low px-4 py-3 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Brand Identity & Media Assets */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">palette</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Brand Identity &amp; Cloudinary Assets
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
          </div>

          {/* Logo & Favicon Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                  Brand Logo (Cloudinary)
                </label>
                <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploadingLogo ? 'opacity-50 pointer-events-none' : ''}`}>
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="hidden" />
                </label>
              </div>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/..."
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-mono text-[12px] outline-none mb-2"
              />
              {formData.logoUrl && (
                <div className="h-12 p-2 bg-surface-container rounded-lg border border-outline-variant/20 inline-flex items-center">
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                  Favicon URL
                </label>
                <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploadingFavicon ? 'opacity-50 pointer-events-none' : ''}`}>
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  <span>{isUploadingFavicon ? 'Uploading...' : 'Upload Favicon'}</span>
                  <input type="file" accept="image/*,.svg" onChange={handleFaviconUpload} disabled={isUploadingFavicon} className="hidden" />
                </label>
              </div>
              <input
                type="text"
                name="faviconUrl"
                value={formData.faviconUrl || ''}
                onChange={handleChange}
                placeholder="/favicon.svg"
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-mono text-[12px] outline-none mb-2"
              />
              {formData.faviconUrl && (
                <div className="w-8 h-8 p-1 bg-surface-container rounded-lg border border-outline-variant/20 flex items-center justify-center">
                  <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Studio Contacts */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">contacts</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Concierge &amp; Studio Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Telephone Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Showroom Locations / Atelier Address
            </label>
            <input
              type="text"
              name="showroomAddress"
              value={formData.showroomAddress}
              onChange={handleChange}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
            />
          </div>
        </div>

        {/* Social Channels */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">share</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Instagram URL
              </label>
              <input
                type="url"
                name="socialInstagram"
                value={formData.socialInstagram}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Pinterest URL
              </label>
              <input
                type="url"
                name="socialPinterest"
                value={formData.socialPinterest}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                Facebook URL
              </label>
              <input
                type="url"
                name="socialFacebook"
                value={formData.socialFacebook}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                YouTube URL
              </label>
              <input
                type="url"
                name="socialYoutube"
                value={formData.socialYoutube || ''}
                onChange={handleChange}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
          >
            Save All Settings to Firestore
          </button>
        </div>
      </form>
    </div>
  );
};
