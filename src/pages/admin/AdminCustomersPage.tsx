import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { formatDate } from '../../utils/formatters';

export const AdminCustomersPage: React.FC = () => {
  const { customerInquiries } = useStoreData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
          Customer &amp; Client Inquiries
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Inquiries received through the studio contact form and bespoke commission queries
        </p>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        {customerInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {customerInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface-container-low/50 align-top">
                    <td className="py-3 px-4 font-semibold text-on-surface">
                      {inq.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[12px]">
                        <a href={`mailto:${inq.email}`} className="text-primary hover:underline block">
                          {inq.email}
                        </a>
                        {inq.phone && <span className="text-outline">{inq.phone}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {inq.subject || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant max-w-sm leading-relaxed">
                      {inq.message}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-outline whitespace-nowrap">
                      {formatDate(inq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-on-surface-variant p-6">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">
              group
            </span>
            <p className="font-body-md">No customer messages received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
