import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/whatsapp';
import { formatDate } from '../../utils/formatters';

export const AdminOrdersPage: React.FC = () => {
  const { orderInquiries, updateOrderStatus } = useStoreData();
  const { showToast } = useToast();

  const handleStatusChange = (id: string, newStatus: any) => {
    updateOrderStatus(id, newStatus);
    showToast(`Order status updated to ${newStatus}`, 'task_alt');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
          Studio Orders &amp; WhatsApp Enquiries
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Log of customer &ldquo;BUY NOW&rdquo; clicks and initiated WhatsApp order conversations
        </p>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        {orderInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Ordered Artifacts</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {orderInquiries.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4 font-mono font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[12px]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-body-sm text-on-surface">
                            <span className="font-semibold">{item.quantity}×</span> {item.productName}{' '}
                            <span className="text-outline text-[11px]">({item.productCode})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-label-sm font-label-sm uppercase tracking-wider font-semibold ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-surface-container-low px-2 py-1 rounded text-body-sm border border-outline-variant/30 outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted on WhatsApp</option>
                        <option value="confirmed">Payment Confirmed</option>
                        <option value="dispatched">Crated &amp; Dispatched</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-on-surface-variant p-6">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">
              receipt_long
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              No orders recorded yet
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
              Whenever a customer clicks &ldquo;BUY NOW&rdquo; on a product page or within their cart, an order inquiry record is captured here for your records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
