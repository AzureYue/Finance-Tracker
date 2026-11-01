import React from 'react';

interface CatPawWatermarkProps {
  className?: string;
  size?: number;
}

export const CatPawWatermark: React.FC<CatPawWatermarkProps> = ({
  className = '',
  size = 72,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={`pointer-events-none select-none text-[#45372F] opacity-[0.06] ${className}`}
      aria-hidden="true"
    >
      {/* Main big pad */}
      <path d="M50 48 C36 48 28 62 30 76 C32 86 42 92 50 92 C58 92 68 86 70 76 C72 62 64 48 50 48 Z" />
      {/* Toe 1 (left) */}
      <ellipse cx="23" cy="42" rx="9" ry="12" transform="rotate(-20 23 42)" />
      {/* Toe 2 (mid left) */}
      <ellipse cx="40" cy="30" rx="9.5" ry="13" transform="rotate(-6 40 30)" />
      {/* Toe 3 (mid right) */}
      <ellipse cx="60" cy="30" rx="9.5" ry="13" transform="rotate(6 60 30)" />
      {/* Toe 4 (right) */}
      <ellipse cx="77" cy="42" rx="9" ry="12" transform="rotate(20 77 42)" />
    </svg>
  );
};
