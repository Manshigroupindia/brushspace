import React, { useState } from 'react';
import type { FestiveCampaignConfig } from '../../types';
import { DEFAULT_FESTIVE_CAMPAIGN } from '../../utils/campaign';

interface FloatingFestiveButtonProps {
  onClick: () => void;
  campaign?: FestiveCampaignConfig;
}

export const FloatingFestiveButton: React.FC<FloatingFestiveButtonProps> = ({
  onClick,
  campaign,
}) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('brushspace_floating_btn_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const config = campaign || DEFAULT_FESTIVE_CAMPAIGN;

  if (isDismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('brushspace_floating_btn_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed bottom-20 md:bottom-8 right-3 sm:right-5 md:right-8 z-30 flex items-center group animate-bounce-subtle select-none"
      style={{ filter: 'drop-shadow(0 4px 14px rgba(180, 83, 9, 0.35))' }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="View Festive Sale offer"
        className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white font-label-md text-label-md uppercase tracking-wider font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300/30"
      >
        <span className="text-[14px] sm:text-[16px]">🎉</span>
        <span className="text-[11px] sm:text-[13px] whitespace-nowrap">
          {config.floatingButtonText || 'FESTIVE SALE — 20% OFF'}
        </span>
      </button>

      {/* Dismiss small X button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss sale button"
        title="Dismiss button"
        className="ml-1 w-6 h-6 rounded-full bg-surface/90 hover:bg-surface text-on-surface-variant hover:text-error flex items-center justify-center text-[12px] shadow-sm transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
