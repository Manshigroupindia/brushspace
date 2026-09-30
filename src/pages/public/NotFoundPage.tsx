import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 — Space Not Found | BRUSHSPACE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center bg-surface px-4 sm:px-6 md:px-gutter-desktop py-12 md:py-20">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Mobile Visual (Stacked first on small screens) / Hidden on Desktop */}
          <div className="flex lg:hidden justify-center items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <DecorativeStillLife className="w-full h-full max-w-[280px]" />
            </div>
          </div>

          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Atelier Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Studio Archive // 404
              </span>
            </div>

            {/* Large 404 Display */}
            <div className="font-serif text-7xl sm:text-8xl lg:text-[7.5rem] leading-none text-on-surface font-light tracking-tight select-none mb-3">
              <span className="text-primary font-normal">4</span>
              <span className="text-tertiary font-serif italic mx-1">0</span>
              <span className="text-primary font-normal">4</span>
            </div>

            {/* Supporting Heading */}
            <h1 className="font-headline-lg lg:font-display text-2xl sm:text-3xl lg:text-[2.5rem] text-on-surface font-normal tracking-tight leading-tight mb-4">
              This Space Doesn't Exist
            </h1>

            {/* Supporting Text */}
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg leading-relaxed mb-8">
              The page you're looking for may have moved, been removed, or never belonged in this collection.
            </p>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-on-secondary-fixed text-surface rounded-lg font-label-md text-label-md uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>GO HOME</span>
              </Link>

              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-surface border border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary rounded-lg font-label-md text-label-md uppercase tracking-widest transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>EXPLORE COLLECTION</span>
              </Link>
            </div>

            {/* Return Tagline */}
            <p className="font-serif italic text-body-sm text-outline mt-8 sm:mt-10">
              Return to where beautiful spaces begin.
            </p>
          </div>

          {/* Right Column: Desktop Artistic Still-Life Composition */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
            <div className="relative w-full max-w-[380px] aspect-[4/5] bg-gradient-to-b from-surface-container-low via-surface-container to-secondary-container/30 rounded-t-[140px] rounded-b-2xl border border-outline-variant/30 p-6 flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              {/* Studio Arch Accent Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none" />

              {/* Handcrafted Visual */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <DecorativeStillLife className="w-full max-w-[280px] h-auto drop-shadow-sm" />
                
                {/* Artwork Title / Atelier Signature */}
                <div className="mt-4 text-center">
                  <span className="font-label-sm text-[10px] uppercase tracking-[0.2em] text-outline font-medium block">
                    BRUSHSPACE STILL LIFE NO. 04
                  </span>
                  <span className="font-serif italic text-xs text-on-surface-variant/80 mt-0.5 block">
                    Wheel-thrown terracotta &amp; botanical shadow
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

interface DecorativeStillLifeProps {
  className?: string;
}

const DecorativeStillLife: React.FC<DecorativeStillLifeProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 320 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Warm Studio Sun Disk Gradient */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDDAF" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#F0BE73" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F5F0EB" stopOpacity="0" />
        </radialGradient>

        {/* Vase Terracotta Gradient */}
        <linearGradient id="terracottaVase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D98A6E" />
          <stop offset="45%" stopColor="#C36B4E" />
          <stop offset="85%" stopColor="#93452B" />
          <stop offset="100%" stopColor="#783119" />
        </linearGradient>

        {/* Vase Glaze Highlight */}
        <linearGradient id="vaseGlaze" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* Pedestal Surface Gradient */}
        <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EAE1DB" />
          <stop offset="100%" stopColor="#CDC5C0" />
        </linearGradient>

        {/* Soft Drop Shadow for Vase */}
        <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1F1B18" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Atmospheric Gallery Sun / Niche Accent */}
      <circle cx="160" cy="140" r="85" fill="url(#sunGlow)" />

      {/* Minimalist Arch Silhouette in background */}
      <path
        d="M95 190 V115 C95 78 124 50 160 50 C196 50 225 78 225 115 V190"
        stroke="#D3C4B3"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        fill="none"
      />

      {/* Botanical Eucalyptus / Olive Branch emerging from vase */}
      <g stroke="#1F1B18" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Main curved branch */}
        <path d="M160 170 C160 145 152 110 135 80 C125 62 105 45 85 40" />

        {/* Secondary branchlet */}
        <path d="M148 125 C162 110 180 95 195 85" strokeWidth="1.25" />
      </g>

      {/* Leaves with earthy terracotta & charcoal tones */}
      <g>
        {/* Left cluster leaves */}
        <path
          d="M85 40 C75 35 68 45 74 52 C80 59 90 48 85 40 Z"
          fill="#93452B"
          opacity="0.9"
        />
        <path
          d="M102 48 C92 46 88 56 95 62 C102 68 110 56 102 48 Z"
          fill="#7A5513"
          opacity="0.85"
        />
        <path
          d="M118 64 C108 65 106 76 114 81 C122 86 128 72 118 64 Z"
          fill="#1F1B18"
          opacity="0.75"
        />
        <path
          d="M133 82 C122 85 122 97 131 101 C140 105 144 91 133 82 Z"
          fill="#93452B"
          opacity="0.9"
        />
        <path
          d="M144 105 C132 110 134 122 143 125 C152 128 155 113 144 105 Z"
          fill="#7A5513"
          opacity="0.85"
        />

        {/* Right branchlet leaves */}
        <path
          d="M168 112 C172 102 183 103 184 112 C185 121 172 120 168 112 Z"
          fill="#93452B"
          opacity="0.8"
        />
        <path
          d="M185 96 C190 86 202 88 201 97 C200 106 188 104 185 96 Z"
          fill="#1F1B18"
          opacity="0.7"
        />
        <path
          d="M195 85 C205 78 215 86 211 94 C207 102 198 94 195 85 Z"
          fill="#7A5513"
          opacity="0.85"
        />
      </g>

      {/* Floating gilded accent leaf */}
      <circle cx="218" cy="74" r="3" fill="#C49A56" />

      {/* Sculptural Ceramic Vase Body */}
      <g filter="url(#softShadow)">
        {/* Neck */}
        <path
          d="M148 168 H172 V182 H148 Z"
          fill="url(#terracottaVase)"
        />
        {/* Rim Ring */}
        <ellipse cx="160" cy="168" rx="14" ry="3.5" fill="#E8A790" stroke="#783119" strokeWidth="1" />
        {/* Vase Body */}
        <path
          d="M148 182 C132 190 116 212 116 238 C116 268 135 288 160 288 C185 288 204 268 204 238 C204 212 188 190 172 182 Z"
          fill="url(#terracottaVase)"
        />
        {/* Soft Glaze overlay */}
        <path
          d="M148 182 C132 190 116 212 116 238 C116 268 135 288 160 288 C185 288 204 268 204 238 C204 212 188 190 172 182 Z"
          fill="url(#vaseGlaze)"
        />
        {/* Artisanal Incised Ribbing Line on Ceramic */}
        <path
          d="M124 236 C136 242 160 244 184 240 C192 238 195 236 195 236"
          stroke="#FFB59D"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M130 252 C142 258 162 260 180 257"
          stroke="#FFB59D"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Sculptural Amphora Left Handle */}
        <path
          d="M134 192 C115 198 108 220 120 236"
          stroke="#93452B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Sculptural Amphora Right Handle */}
        <path
          d="M186 192 C205 198 212 220 200 236"
          stroke="#783119"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Cast Shadow of Vase on Pedestal */}
      <ellipse cx="160" cy="289" rx="36" ry="6" fill="#1F1B18" opacity="0.16" />

      {/* Studio Pedestal / Plinth */}
      <g>
        {/* Pedestal Top Surface */}
        <polygon points="55,290 265,290 250,302 70,302" fill="url(#pedestalGrad)" />
        {/* Pedestal Front Edge */}
        <rect x="70" y="302" width="180" height="8" rx="1" fill="#CDC5C0" />
        {/* Studio Ground Horizon Line */}
        <line x1="20" y1="290" x2="300" y2="290" stroke="#D3C4B3" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Fallen Botanical Petal on Pedestal */}
      <path
        d="M208 293 C214 290 220 293 218 296 C216 299 210 297 208 293 Z"
        fill="#93452B"
        opacity="0.8"
      />
    </svg>
  );
};
