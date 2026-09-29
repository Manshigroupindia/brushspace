import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', showText = true }) => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      {/* Brand Monogram Mark SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
        className={`${className} aspect-square shrink-0`}
        fill="none"
      >
        <rect
          width="60"
          height="60"
          rx="12"
          fill="#F5F0EB"
          stroke="#DFD3C3"
          strokeWidth="1.5"
        />
        {/* Abstract Brush Stroke & Interior Space Arch */}
        <path
          d="M22 48 C 22 28, 38 20, 44 20 C 40 28, 38 38, 42 46 C 45 42, 47 34, 46 26 C 50 32, 48 44, 38 48 Z"
          fill="#C36B4E"
        />
        <path
          d="M26 48 C 26 32, 34 24, 40 22"
          stroke="#1F1B18"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="43" cy="23" r="2.5" fill="#C49A56" />
        {/* Framing minimal line */}
        <path
          d="M18 50 L48 50"
          stroke="#1F1B18"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col shrink-0 whitespace-nowrap">
          <span className="font-headline-sm text-lg md:text-headline-sm font-semibold tracking-wider text-on-surface group-hover:text-primary transition-colors leading-tight">
            BRUSHSPACE
          </span>
          <span className="font-label-sm text-[10px] md:text-label-sm text-primary tracking-widest uppercase font-medium leading-none mt-0.5">
            Artistic Décor
          </span>
        </div>
      )}
    </Link>
  );
};
