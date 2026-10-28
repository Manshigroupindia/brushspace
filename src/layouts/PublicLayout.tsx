import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { SearchModal } from '../components/common/SearchModal';
import { FestiveSalePopup } from '../components/common/FestiveSalePopup';
import { FloatingFestiveButton } from '../components/common/FloatingFestiveButton';
import { useStoreData } from '../context/StoreDataContext';
import { isCampaignActive } from '../utils/campaign';

export const PublicLayout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFestivePopupOpen, setIsFestivePopupOpen] = useState(false);
  const { settings } = useStoreData();

  const campaignActive = isCampaignActive(settings.festiveCampaign);

  // Auto-open promotional popup once per session after initial load
  useEffect(() => {
    if (!campaignActive) return;

    try {
      const alreadyShown = sessionStorage.getItem('brushspace_festive_popup_shown');
      if (!alreadyShown) {
        // Small 1.2s delay for seamless initial page render
        const timer = setTimeout(() => {
          setIsFestivePopupOpen(true);
          sessionStorage.setItem('brushspace_festive_popup_shown', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, [campaignActive]);

  const handleClosePopup = () => {
    setIsFestivePopupOpen(false);
    try {
      sessionStorage.setItem('brushspace_festive_popup_shown', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface relative">
      {/* Sticky Header: Announcement Bar + Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-surface shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/15">
        <AnnouncementBar />
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      </header>

      {/* Main Content Area (Natural top flow, 80-96px mobile bottom padding for fixed bottom nav) */}
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Mobile Bottom Navigation (Visible ONLY below 768px) */}
      <MobileBottomNav />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Festive Promotion Components (Public only) */}
      {campaignActive && (
        <>
          <FloatingFestiveButton
            onClick={() => setIsFestivePopupOpen(true)}
            campaign={settings.festiveCampaign}
          />
          <FestiveSalePopup
            isOpen={isFestivePopupOpen}
            onClose={handleClosePopup}
            campaign={settings.festiveCampaign}
          />
        </>
      )}
    </div>
  );
};
