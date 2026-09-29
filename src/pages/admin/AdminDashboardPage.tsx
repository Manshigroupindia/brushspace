import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/whatsapp';

export const AdminDashboardPage: React.FC = () => {
  const { products, categories, orderInquiries, customerInquiries, metrics, runOneClickMigration } = useStoreData();
  const { showToast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    document.title = 'Admin Studio Dashboard — BRUSHSPACE';
  }, []);

  const handleRunMigration = async () => {
    if (!window.confirm('Sync and push all 28 handcrafted Brushspace products, categories, banners, testimonials, and FAQs directly into Firestore?')) {
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

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const featuredProducts = products.filter((p) => p.featured && p.isActive).length;
  const newArrivals = products.filter((p) => p.newArrival && p.isActive).length;
  const totalCategories = categories.length;
  const wishlistCount = metrics.wishlistAdditions;
  const buyNowClicks = metrics.buyNowClicks + orderInquiries.length;
  const totalInquiries = customerInquiries.length;

  const statCards = [
    { label: 'Total Products', value: totalProducts, icon: 'inventory_2', color: 'text-primary' },
    { label: 'Active in Studio', value: activeProducts, icon: 'check_circle', color: 'text-emerald-700' },
    { label: 'Medium Categories', value: totalCategories, icon: 'category', color: 'text-primary-container' },
    { label: 'Featured Pieces', value: featuredProducts, icon: 'star', color: 'text-tertiary' },
    { label: 'New Arrivals', value: newArrivals, icon: 'fiber_new', color: 'text-primary' },
    { label: 'Wishlist Count', value: wishlistCount, icon: 'favorite', color: 'text-tertiary' },
    { label: 'Buy Now Clicks', value: buyNowClicks, icon: 'chat', color: 'text-emerald-700' },
    { label: 'Contact Enquiries', value: totalInquiries, icon: 'mail', color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            Atelier Overview
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Performance metrics, live catalog status, and direct WhatsApp customer orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Migration Alert Banner if Firestore has no products yet */}
      {totalProducts === 0 && (
        <div className="bg-primary/10 border border-primary/30 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-[24px]">cloud_sync</span>
              <h3 className="font-title-md text-title-md font-semibold text-on-surface">
                First-Time Firestore Catalog Initialization
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
              Your Firestore database is ready. Push all 28 handcrafted Brushspace products, categories, banners, testimonials, and FAQs with permanent Cloudinary assets into Firestore with 1 click.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRunMigration}
            disabled={isMigrating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-surface rounded-lg font-label-md uppercase tracking-wider hover:bg-on-secondary-fixed transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMigrating ? 'hourglass_top' : 'publish'}
            </span>
            {isMigrating ? 'Synchronizing...' : 'Initialize Firestore'}
          </button>
        </div>
      )}

      {/* 8 Stats Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                {card.label}
              </span>
              <span className={`material-symbols-outlined text-[22px] ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <p className="font-headline-md text-headline-md font-bold text-on-surface">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Dual Tables: Orders and Customer Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent WhatsApp Orders (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-outline-variant/20 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                Recent WhatsApp Order Dispatches
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Customer Buy Now requests transmitted to studio
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="font-label-sm text-label-sm uppercase tracking-wider text-primary hover:underline font-semibold"
            >
              View All
            </Link>
          </div>

          {orderInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-outline-variant/15 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    <th className="py-2.5 pr-2">Order ID</th>
                    <th className="py-2.5 px-2">Pieces</th>
                    <th className="py-2.5 px-2">Total</th>
                    <th className="py-2.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {orderInquiries.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low">
                      <td className="py-3 pr-2 font-mono font-medium text-primary">
                        {order.id}
                      </td>
                      <td className="py-3 px-2">
                        {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>
                      <td className="py-3 px-2 font-semibold text-on-surface">
                        {formatINR(order.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant font-body-sm">
              No orders registered yet. Clicks on &ldquo;BUY NOW&rdquo; will log inquiries here automatically.
            </div>
          )}
        </div>

        {/* Right: Studio Messages & Quick Links (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-outline-variant/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                Client Contact Inquiries
              </h2>
              <Link
                to="/admin/customers"
                className="font-label-sm text-label-sm uppercase tracking-wider text-primary hover:underline font-semibold"
              >
                Directory
              </Link>
            </div>

            {customerInquiries.length > 0 ? (
              <div className="space-y-3">
                {customerInquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/15"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-title-md text-title-md font-semibold text-on-surface">
                        {inq.name}
                      </p>
                      <span className="text-[11px] text-outline">{inq.phone || inq.email}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      {inq.subject}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant/80 line-clamp-2 mt-1">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-on-surface-variant py-4">No contact messages received.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/15 flex flex-wrap gap-2">
            <Link
              to="/admin/settings"
              className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              Configure WhatsApp &amp; Contacts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
