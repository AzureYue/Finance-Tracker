import React from 'react';

interface WhiskerProgressBarProps {
  progress: number; // 0 to 100+
  max?: number;
  current?: number;
  variant?: 'terracotta' | 'ochre' | 'matcha' | 'dynamic';
  showWhiskersMarker?: boolean;
  className?: string;
  milestones?: number[]; // e.g. [50, 80]
}

export const WhiskerProgressBar: React.FC<WhiskerProgressBarProps> = ({
  progress,
  variant = 'dynamic',
  showWhiskersMarker = true,
  className = '',
  milestones = [50, 80],
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  let barColor = '#A6533D'; // Terracotta default
  let glowColor = 'rgba(166, 83, 61, 0.2)';

  if (variant === 'dynamic') {
    if (clamped < 65) {
      barColor = '#7A8471'; // Matcha safe zone
      glowColor = 'rgba(122, 132, 113, 0.25)';
    } else if (clamped < 85) {
      barColor = '#E9C66A'; // Ochre warning
      glowColor = 'rgba(233, 198, 106, 0.35)';
    } else {
      barColor = '#A6533D'; // Terracotta alert
      glowColor = 'rgba(166, 83, 61, 0.35)';
    }
  } else if (variant === 'ochre') {
    barColor = '#E9C66A';
    glowColor = 'rgba(233, 198, 106, 0.3)';
  } else if (variant === 'matcha') {
    barColor = '#7A8471';
    glowColor = 'rgba(122, 132, 113, 0.25)';
  }

  return (
    <div className={`relative pt-3 pb-2 select-none ${className}`}>
      {/* Background track */}
      <div className="relative h-2.5 w-full bg-[#E8DFD1]/70 rounded-full overflow-hidden">
        {/* Milestone tick marks */}
        {milestones.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-0.5 bg-[#DAC1BB] z-10"
            style={{ left: `${m}%` }}
            title={`Milestone: ${m}%`}
          />
        ))}

        {/* Filled bar */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        />
      </div>

      {/* Whiskered Cat Marker floating right above/on the progress tip */}
      {showWhiskersMarker && (
        <div
          className="absolute -top-1 transition-all duration-500 ease-out pointer-events-none transform -translate-x-1/2"
          style={{ left: `${Math.max(4, Math.min(clamped, 96))}%` }}
        >
          <div className="relative flex items-center justify-center">
            {/* Left whiskers */}
            <div className="flex flex-col gap-0.5 -mr-0.5 opacity-60">
              <span className="w-2.5 h-[1.5px] bg-[#45372F] rounded-full transform -rotate-12 block" />
              <span className="w-3 h-[1.5px] bg-[#45372F] rounded-full block" />
              <span className="w-2.5 h-[1.5px] bg-[#45372F] rounded-full transform rotate-12 block" />
            </div>

            {/* Cat Face Bead */}
            <div
              className="w-5 h-4.5 rounded-full border border-[#FFFDF8] flex items-center justify-center shadow-xs"
              style={{ backgroundColor: barColor }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFFDF8] opacity-90" />
            </div>

            {/* Right whiskers */}
            <div className="flex flex-col gap-0.5 -ml-0.5 opacity-60">
              <span className="w-2.5 h-[1.5px] bg-[#45372F] rounded-full transform rotate-12 block" />
              <span className="w-3 h-[1.5px] bg-[#45372F] rounded-full block" />
              <span className="w-2.5 h-[1.5px] bg-[#45372F] rounded-full transform -rotate-12 block" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
