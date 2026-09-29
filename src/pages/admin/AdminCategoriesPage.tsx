import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import type { Category } from '../../types';
import { slugify } from '../../utils/formatters';
import { uploadImage } from '../../services/cloudinary';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, updateProduct } = useStoreData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    badge: '',
    displayOrder: 1,
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleCategoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    showToast('Uploading category image to Cloudinary...', 'cloud_upload');
    try {
      const res = await uploadImage(file, 'brushspace/categories');
      setFormData((prev) => ({ ...prev, image: res.secureUrl }));
      showToast('Category image uploaded to Cloudinary.', 'task_alt');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      badge: '',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      badge: cat.badge || '',
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      updateCategory(editingId, {
        ...formData,
        slug: formData.slug || slugify(formData.name),
      });
      showToast('Category updated.', 'task_alt');
    } else {
      addCategory({
        ...formData,
        slug: formData.slug || slugify(formData.name),
      });
      showToast('New discipline category created.', 'task_alt');
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    // Check if products belong to this category
    const catDoc = categories.find((c) => c.id === id);
    const catSlug = catDoc?.slug?.toLowerCase() || '';
    const linkedProducts = products.filter(
      (p) =>
        p.category.toLowerCase() === name.toLowerCase() ||
        (catSlug && p.category.toLowerCase() === catSlug)
    );

    if (linkedProducts.length > 0) {
      const confirmMove = window.confirm(
        `Warning: ${linkedProducts.length} product(s) belong to category "${name}".\n\nDeleting this category will preserve those products and reassign them to "Uncategorized".\n\nAre you sure you want to proceed with deletion?`
      );
      if (!confirmMove) return;

      try {
        for (const prod of linkedProducts) {
          await updateProduct(prod.id, { category: 'Uncategorized' });
        }
        await deleteCategory(id);
        showToast(`Category "${name}" deleted. ${linkedProducts.length} product(s) reassigned to Uncategorized.`, 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete category. Please try again.', 'error');
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
      try {
        await deleteCategory(id);
        showToast('Category deleted successfully.', 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete category. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Medium Categories
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Organize handcrafted home décor collections and navigation groupings
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-surface rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-surface-container overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                {cat.badge && (
                  <span className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-label-sm uppercase font-semibold">
                    {cat.badge}
                  </span>
                )}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                  cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface/80 text-outline'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline-sm text-headline-sm font-medium text-on-surface">
                    {cat.name}
                  </h3>
                  <span className="text-label-sm font-label-sm text-outline font-mono">
                    Order: #{cat.displayOrder}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-primary mb-2">/category/{cat.slug}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/15 bg-surface-container-low flex items-center justify-between">
              <button
                onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary"
              >
                {cat.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded hover:bg-surface text-on-surface-variant hover:text-primary transition-colors"
                  title="Edit Category"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded hover:bg-surface text-on-surface-variant hover:text-error transition-colors"
                  title="Delete Category"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-secondary-fixed/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/20 animate-scaleIn">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-semibold">
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: !editingId ? slugify(e.target.value) : formData.slug,
                    })
                  }
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Badge Label (e.g. 01 / Form)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="01 / Form"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                    Category Image (Cloudinary)
                  </label>
                  <label className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary hover:underline ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryUpload}
                      disabled={isUploading}
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
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  id="catActive"
                  className="w-4 h-4 rounded text-primary"
                />
                <label htmlFor="catActive" className="font-label-sm text-label-sm uppercase tracking-wider font-semibold cursor-pointer">
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
