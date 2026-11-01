import React from 'react';

interface SleepingCatEmptyStateProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SleepingCatEmptyState: React.FC<SleepingCatEmptyStateProps> = ({
  title = 'Purr-fect! No expenses logged yet today.',
  subtitle = 'Take a deep breath, enjoy your coffee or campus stroll. Your student wallet is at rest.',
  actionText = 'Log a quick coffee or lunch',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#FFFDF8] border border-[#E8DFD1] shadow-cozy-1 my-6 relative overflow-hidden">
      {/* Decorative cozy desk cat illustration */}
      <div className="relative mb-4 w-44 h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 200 130"
          className="w-full h-full stroke-[#45372F] fill-none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cozy cushion mat */}
          <ellipse
            cx="100"
            cy="110"
            rx="85"
            ry="14"
            className="stroke-[#DAC1BB] fill-[#F5F0E6]"
            strokeDasharray="4 4"
          />

          {/* Curled cat body */}
          <path
            d="M 55 98 C 45 75, 60 48, 95 48 C 130 48, 150 70, 145 96 C 142 106, 120 110, 95 110 C 70 110, 58 106, 55 98 Z"
            className="fill-[#FFFDF8] stroke-[#45372F]"
          />

          {/* Cat Tail wrapped around */}
          <path
            d="M 145 92 C 158 85, 162 70, 152 64 C 145 60, 138 68, 134 74"
            className="stroke-[#A6533D]"
            strokeWidth="3.5"
          />

          {/* Cat Head tucked in */}
          <circle cx="72" cy="80" r="18" className="fill-[#FFFDF8] stroke-[#45372F]" />

          {/* Ears */}
          <path d="M 60 70 L 54 56 L 68 64 Z" className="fill-[#FBE4D8] stroke-[#45372F]" />
          <path d="M 75 64 L 84 54 L 86 68 Z" className="fill-[#FBE4D8] stroke-[#45372F]" />

          {/* Sleeping closed happy eyes: ^ ^ or curved crescents */}
          <path d="M 63 80 Q 66 84 69 80" className="stroke-[#45372F]" strokeWidth="2" />
          <path d="M 73 80 Q 76 84 79 80" className="stroke-[#45372F]" strokeWidth="2" />

          {/* Cute pink button nose */}
          <polygon points="71,84 75,84 73,86" className="fill-[#A6533D] stroke-none" />

          {/* Subtle whiskers */}
          <line x1="56" y1="82" x2="46" y2="80" className="stroke-[#88726D]" strokeWidth="1.5" />
          <line x1="56" y1="86" x2="47" y2="88" className="stroke-[#88726D]" strokeWidth="1.5" />
          <line x1="84" y1="83" x2="94" y2="82" className="stroke-[#88726D]" strokeWidth="1.5" />
          <line x1="83" y1="87" x2="93" y2="89" className="stroke-[#88726D]" strokeWidth="1.5" />

          {/* Soft paws tucked under chin */}
          <ellipse cx="88" cy="95" rx="7" ry="5" className="fill-[#FFFDF8] stroke-[#45372F]" />
          <ellipse cx="78" cy="97" rx="6" ry="5" className="fill-[#FFFDF8] stroke-[#45372F]" />

          {/* Floating gentle z Z */}
          <text
            x="130"
            y="42"
            className="fill-[#A6533D] font-bold text-xs select-none stroke-none font-sans opacity-70"
          >
            z
          </text>
          <text
            x="142"
            y="30"
            className="fill-[#E9C66A] font-extrabold text-sm select-none stroke-none font-sans opacity-90"
          >
            Z
          </text>
        </svg>
      </div>

      <h4 className="text-lg font-bold text-[#45372F] mb-1 font-sans">
        {title}
      </h4>
      <p className="text-sm text-[#786E65] max-w-sm mb-5 leading-relaxed">
        {subtitle}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#FFFDF8] bg-[#A6533D] hover:bg-[#8E4330] rounded-lg transition-all transform active:scale-95 shadow-sm cursor-pointer"
        >
          <span>🐾</span>
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
