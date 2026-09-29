import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/whatsapp';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    toggleProductActive,
    toggleProductFeatured,
    toggleProductNewArrival,
  } = useStoreData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.productCode.toLowerCase().includes(search.toLowerCase()) ||
        p.material.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete this product: "${name}"?`)) {
      try {
        await deleteProduct(id);
        showToast('Product deleted successfully.', 'task_alt');
      } catch (err: any) {
        showToast('Unable to delete product. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Product Catalog
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Manage handcrafted pieces, prices, materials, dimensions, and spotlight statuses
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface p-4 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, code, material..."
            className="w-full bg-surface-container-low pl-10 pr-4 py-2 rounded-lg border border-outline-variant/30 text-body-sm font-body-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 font-label-sm text-label-sm uppercase tracking-wider outline-none"
          >
            <option value="all">All Disciplines</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="py-3 px-4">Artifact</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">New</th>
                <th className="py-3 px-4 text-center">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0 border border-outline-variant/15"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/product/${prod.slug}`}
                          target="_blank"
                          className="font-title-md text-title-md font-semibold text-on-surface hover:text-primary transition-colors block truncate max-w-[200px]"
                        >
                          {prod.name}
                        </Link>
                        <span className="font-mono text-[11px] text-primary block">
                          {prod.productCode} • {prod.material}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-label-sm text-label-sm uppercase text-on-surface-variant">
                    {prod.category}
                  </td>

                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {formatINR(prod.price)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleProductFeatured(prod.id)}
                      className={`p-1 rounded-full transition-colors ${
                        prod.featured ? 'text-primary' : 'text-outline/40 hover:text-outline'
                      }`}
                      title="Toggle Featured"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${prod.featured ? 'material-symbols-fill' : ''}`}>
                        star
                      </span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleProductNewArrival(prod.id)}
                      className={`p-1 rounded-full transition-colors ${
                        prod.newArrival ? 'text-tertiary' : 'text-outline/40 hover:text-outline'
                      }`}
                      title="Toggle New Arrival"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        fiber_new
                      </span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleProductActive(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-label-sm uppercase tracking-wider font-semibold transition-colors ${
                        prod.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${prod.id}/edit`}
                        className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                        title="Delete Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant">
            No products match the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};
