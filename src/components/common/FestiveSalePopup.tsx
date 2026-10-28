import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FestiveCampaignConfig } from '../../types';
import { DEFAULT_FESTIVE_CAMPAIGN } from '../../utils/campaign';

interface FestiveSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: FestiveCampaignConfig;
}

export const FestiveSalePopup: React.FC<FestiveSalePopupProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const navigate = useNavigate();
  const config = campaign || DEFAULT_FESTIVE_CAMPAIGN;

  // Listen for ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShopNow = () => {
    onClose();
    navigate(config.ctaLink || '/shop');
  };

  const bannerImg =
    config.bannerImage ||
    'https://res.cloudinary.com/f3nn4gbc/image/upload/v1790699698/brushspace/banners/banner_ban-spotlight-1.jpg';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="festive-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-surface rounded-2xl shadow-2xl border border-amber-600/30 overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close festive announcement"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-surface/90 hover:bg-surface text-on-surface hover:text-primary transition-colors flex items-center justify-center shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Promotional Image Header */}
        <div className="relative w-full h-44 sm:h-52 bg-surface-container-low shrink-0 overflow-hidden">
          <img
            src={bannerImg}
            alt={config.campaignName}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-black/30"></div>

          {/* Floating festive celebration badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white font-label-sm text-[10px] sm:text-label-sm uppercase tracking-widest font-bold shadow-md">
              <span>✨</span>
              <span>LIMITED-TIME PROMOTION</span>
            </span>
          </div>

          {/* Discount Pill over Image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="bg-surface/95 backdrop-blur-md px-3 py-1 rounded-lg border border-outline-variant/20 shadow-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                {config.campaignName}
              </span>
            </div>
            <span className="text-3xl sm:text-4xl font-headline-lg font-bold text-amber-700 dark:text-amber-300 drop-shadow-sm">
              {config.discountPercentage}% OFF
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-3 text-center overflow-y-auto">
          <h2
            id="festive-popup-title"
            className="font-headline-md text-headline-md sm:text-headline-lg text-on-surface font-semibold leading-tight tracking-tight"
          >
            {config.headline}
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            {config.supportingLine}
          </p>

          {/* Policy reassurance pill */}
          <div className="mt-1 py-1.5 px-3 rounded-lg bg-surface-container-low border border-outline-variant/15 text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant">
            <span>NO RETURN • NO REFUND • NO EXCHANGE • SHIPPING PAYABLE BY CUSTOMER</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2 pt-2">
            <button
              type="button"
              onClick={handleShopNow}
              className="w-full py-3.5 px-6 rounded-lg bg-on-secondary-fixed text-surface font-label-md text-label-md uppercase tracking-widest font-semibold hover:bg-primary transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{config.ctaText}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Browsing Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
