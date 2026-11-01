import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  prefix?: string;
  sign?: '+' | '-' | 'auto' | 'none';
  size?: 'display' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  colorScheme?: 'espresso' | 'matcha' | 'terracotta' | 'muted' | 'auto';
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  prefix = 'RM',
  sign = 'none',
  size = 'md',
  colorScheme = 'auto',
  className = '',
}) => {
  const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [integerPart, decimalPart] = formattedAmount.split('.');

  let displaySign = '';
  if (sign === 'auto') {
    displaySign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  } else if (sign === '+') {
    displaySign = '+';
  } else if (sign === '-') {
    displaySign = '-';
  }

  // Determine text color based on scheme or sign
  let colorClass = 'text-[#45372F]';
  if (colorScheme === 'matcha' || (colorScheme === 'auto' && displaySign === '+')) {
    colorClass = 'text-[#7A8471]'; // Soft Matcha Green for inflows
  } else if (colorScheme === 'terracotta') {
    colorClass = 'text-[#A6533D]';
  } else if (colorScheme === 'muted') {
    colorClass = 'text-[#786E65]';
  } else if (colorScheme === 'espresso' || (colorScheme === 'auto' && displaySign === '-')) {
    colorClass = 'text-[#45372F]'; // Neutral Primary Deep Espresso Brown as requested
  }

  // Size variations
  const sizeStyles = {
    display: {
      sign: 'text-2xl font-bold mr-1',
      prefix: 'text-xl sm:text-2xl font-semibold text-[#786E65] mr-1.5',
      integer: 'text-3xl sm:text-4xl font-extrabold tracking-tight',
      decimal: 'text-2xl sm:text-3xl font-bold opacity-90',
    },
    xl: {
      sign: 'text-lg font-bold mr-0.5',
      prefix: 'text-base font-semibold text-[#786E65] mr-1',
      integer: 'text-2xl font-bold tracking-tight',
      decimal: 'text-lg font-semibold opacity-90',
    },
    lg: {
      sign: 'text-base font-semibold mr-0.5',
      prefix: 'text-sm font-semibold text-[#786E65] mr-1',
      integer: 'text-xl font-bold',
      decimal: 'text-base font-semibold opacity-90',
    },
    md: {
      sign: 'text-sm font-semibold mr-0.5',
      prefix: 'text-xs font-semibold text-[#786E65] mr-1',
      integer: 'text-base font-bold',
      decimal: 'text-xs font-semibold opacity-90',
    },
    sm: {
      sign: 'text-xs font-semibold mr-0.5',
      prefix: 'text-[11px] font-semibold text-[#786E65] mr-0.5',
      integer: 'text-sm font-semibold',
      decimal: 'text-xs font-medium opacity-85',
    },
    xs: {
      sign: 'text-[10px] font-medium mr-0.5',
      prefix: 'text-[10px] font-medium text-[#786E65] mr-0.5',
      integer: 'text-xs font-semibold',
      decimal: 'text-[10px] font-medium opacity-80',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-baseline tabular-numbers font-sans ${colorClass} ${className}`}
    >
      {displaySign && <span className={sizeStyles.sign}>{displaySign}</span>}
      <span className={sizeStyles.prefix}>{prefix}</span>
      <span className={sizeStyles.integer}>{integerPart}</span>
      <span className={sizeStyles.decimal}>.{decimalPart}</span>
    </span>
  );
};
