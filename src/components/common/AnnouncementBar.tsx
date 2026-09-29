import React from 'react';
import { useStoreData } from '../../context/StoreDataContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStoreData();

  if (!settings.isAnnouncementBarActive || !settings.announcementBarText) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="w-full bg-secondary-container text-on-secondary-fixed h-[34px] px-4 flex items-center justify-center text-center border-b border-outline-variant/20 overflow-hidden">
      <p className="font-label-sm text-[11px] md:text-label-sm uppercase tracking-widest text-on-secondary-fixed-variant truncate">
        {settings.announcementBarText}
      </p>
    </aside>
  );
};
