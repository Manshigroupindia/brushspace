import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/formatters';
import { uploadImage } from '../../services/cloudinary';
import type { Product } from '../../types';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct } = useStoreData();
  const { showToast } = useToast();

  const isEditing = !!id && id !== 'new';
  const existingProduct = products.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    productCode: '',
    price: 3500,
    compareAtPrice: 0,
    shortDescription: '',
    description: '',
    category: 'Vases',
    subcategory: '',
    material: '',
    height: '30 cm',
    width: '16 cm',
    diameter: '12 cm',
    weight: '1.5 kg',
    color: '',
    tags: '',
    stockStatus: 'in_stock' as Product['stockStatus'],
    featured: false,
    newArrival: false,
    isActive: true,
  });

  const [imageList, setImageList] = useState<string[]>([]);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && existingProduct) {
      document.title = `Edit "${existingProduct.name}" — Admin`;
      setFormData({
        name: existingProduct.name,
        slug: existingProduct.slug,
        productCode: existingProduct.productCode,
        price: existingProduct.price,
        compareAtPrice: existingProduct.compareAtPrice || 0,
        shortDescription: existingProduct.shortDescription,
        description: existingProduct.description,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory || '',
        material: existingProduct.material,
        height: existingProduct.dimensions.height || '',
        width: existingProduct.dimensions.width || '',
        diameter: existingProduct.dimensions.diameter || '',
        weight: existingProduct.dimensions.weight || '',
        color: existingProduct.color,
        tags: existingProduct.tags.join(', '),
        stockStatus: existingProduct.stockStatus,
        featured: existingProduct.featured,
        newArrival: existingProduct.newArrival,
        isActive: existingProduct.isActive,
      });
      setImageList(existingProduct.images || []);
    } else {
      document.title = 'Add New Product — Admin';
      setImageList([]);
    }
  }, [isEditing, existingProduct]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !isEditing ? slugify(val) : prev.slug,
    }));
  };

  // Cloudinary image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    showToast(`Uploading ${files.length} image(s) to Cloudinary...`, 'cloud_upload');

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadImage(file, 'brushspace/products')
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secureUrl);
      setImageList((prev) => [...prev, ...newUrls]);
      showToast(`Uploaded ${results.length} images to Cloudinary.`, 'task_alt');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast(err.message || 'Failed to upload images to Cloudinary.', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setImageList((prev) => [...prev, manualUrlInput.trim()]);
    setManualUrlInput('');
    showToast('Image URL added.', 'task_alt');
  };

  const handleRemoveImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= imageList.length) return;
    const updated = [...imageList];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setImageList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.productCode.trim()) {
      showToast('Name and Product Code are required.', 'error');
      return;
    }

    const fallbackImage =
      'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699700/brushspace/products/prod_cindrella-sculptural-vase_1.jpg';

    const finalImages = imageList.length > 0 ? imageList : [fallbackImage];

    const productPayload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || slugify(formData.name),
      productCode: formData.productCode.trim().toUpperCase(),
      price: Number(formData.price) || 0,
      compareAtPrice: Number(formData.compareAtPrice) || undefined,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      images: finalImages,
      material: formData.material.trim(),
      dimensions: {
        height: formData.height.trim() || undefined,
        width: formData.width.trim() || undefined,
        diameter: formData.diameter.trim() || undefined,
        weight: formData.weight.trim() || undefined,
      },
      color: formData.color.trim() || 'Natural Clay',
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      stockStatus: formData.stockStatus,
      featured: formData.featured,
      newArrival: formData.newArrival,
      isActive: formData.isActive,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await updateProduct(id, productPayload);
        showToast('Product successfully updated in Firestore.', 'task_alt');
      } else {
        await addProduct(productPayload);
        showToast('New product created in Firestore.', 'task_alt');
      }
      navigate('/admin/products');
    } catch (err: any) {
      console.error('Save product error:', err);
      showToast('Failed to save product: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/products"
              className="text-label-sm font-label-sm uppercase tracking-wider text-outline hover:text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Products Catalog
            </Link>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            {isEditing ? `Edit: ${existingProduct?.name}` : 'New Artisan Piece'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="px-6 py-2.5 rounded-lg bg-on-secondary-fixed text-surface font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <span className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin"></span>}
            <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        {/* Core Identifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Cindrella Sculptural Vase"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Product Code / SKU *
            </label>
            <input
              type="text"
              required
              value={formData.productCode}
              onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
              placeholder="e.g. BS-VAS-01"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono uppercase outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
            URL Slug
          </label>
          <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/30 px-3">
            <span className="font-mono text-outline text-[12px]">/product/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-transparent py-2.5 px-1 text-body-sm font-mono outline-none"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Price (INR ₹) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Compare At Price (INR ₹)
            </label>
            <input
              type="number"
              value={formData.compareAtPrice}
              onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Stock Status
            </label>
            <select
              value={formData.stockStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockStatus: e.target.value as Product['stockStatus'],
                })
              }
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock (Atelier Batch)</option>
              <option value="made_to_order">Made to Order</option>
              <option value="out_of_stock">Sold Out / Archive</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Category Medium *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Subcategory / Technique
            </label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="e.g. Sculptural Terracotta"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
            Short Description (Catalog Preview)
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Single sentence summarizing finish, silhouette, and presence"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
          />
        </div>

        {/* Full Narrative */}
        <div>
          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
            Detailed Atelier Narrative
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed craftsmanship narrative..."
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Materials and Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Material(s)
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="e.g. Terracotta, Brass Leaf, Spun Wire"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
              Color Finish
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="e.g. Charcoal Black &amp; Gold"
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
              Height
            </label>
            <input
              type="text"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="32 cm"
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
              Width
            </label>
            <input
              type="text"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              placeholder="18 cm"
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
              Diameter
            </label>
            <input
              type="text"
              value={formData.diameter}
              onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
              placeholder="14 cm"
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1">
              Weight
            </label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="1.8 kg"
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Vase, Terracotta, Sculptural, Gold Leaf"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
          />
        </div>

        {/* ======================================================== */}
        {/* CLOUDINARY MULTI-IMAGE UPLOAD & GALLERY MANAGER */}
        {/* ======================================================== */}
        <div className="space-y-4 pt-2 border-t border-outline-variant/15">
          <div className="flex items-center justify-between">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                Product Imagery (Cloudinary CDN)
              </label>
              <p className="text-body-sm text-on-surface-variant text-[12px]">
                Upload high-res files directly to Cloudinary or paste image URLs. First image is used as primary thumbnail.
              </p>
            </div>
            <label className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors text-label-sm font-label-sm uppercase tracking-wider font-semibold border border-outline-variant/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>{isUploading ? 'Uploading...' : 'Upload to Cloudinary'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Previews & Reordering Grid */}
          {imageList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageList.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container shadow-sm flex flex-col justify-between"
                >
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Position Badge */}
                  <span className="absolute top-2 left-2 bg-on-secondary-fixed/80 backdrop-blur-sm text-surface text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {idx === 0 ? 'Primary' : `#${idx + 1}`}
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'left')}
                        title="Move left"
                        className="p-1.5 bg-surface text-on-surface rounded-full hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove image"
                      className="p-1.5 bg-error text-surface rounded-full hover:bg-error/90"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                    {idx < imageList.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'right')}
                        title="Move right"
                        className="p-1.5 bg-surface text-on-surface rounded-full hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center text-on-surface-variant font-body-sm bg-surface-container-low/50">
              <span className="material-symbols-outlined text-[36px] text-outline mb-2">add_photo_alternate</span>
              <p>No product imagery attached yet. Click &ldquo;Upload to Cloudinary&rdquo; above.</p>
            </div>
          )}

          {/* Manual URL input fallback */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="Or paste external image URL..."
              className="flex-1 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-mono text-[12px] outline-none"
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg text-label-sm font-label-sm uppercase tracking-wider border border-outline-variant/20"
            >
              Add URL
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-primary"
            />
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Featured Piece
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.newArrival}
              onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
              className="w-4 h-4 rounded text-primary"
            />
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              New Arrival
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
              Active in Live Store
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-outline-variant/15 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-8 py-3 rounded-lg bg-on-secondary-fixed text-surface font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <span className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin"></span>}
            <span>{isEditing ? 'Save Product Changes' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
