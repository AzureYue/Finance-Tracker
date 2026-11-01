import React from 'react';
import { Plus, Download, Flame, LogOut } from 'lucide-react';
import { StudentProfile } from '../types';
import { User } from 'firebase/auth';

interface HeaderProps {
  profile: StudentProfile;
  currentUser: User | null;
  onOpenQuickAdd: () => void;
  onOpenExport: () => void;
  onOpenSplitTool: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentUser,
  onOpenQuickAdd,
  onOpenExport,
  onOpenSplitTool,
  onSignOut,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const displayName = currentUser?.displayName || profile.name;
  const userPhoto = currentUser?.photoURL;

  return (
    <header className="border-b border-[#E8DFD1] bg-[#FFFDF8]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: Brand & Student Campus Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFEADF] border border-[#DAC1BB] flex items-center justify-center text-xl shadow-xs relative group cursor-default">
              <span className="transform group-hover:scale-110 transition-transform select-none">🐱☕</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#7A8471] border-2 border-[#FFFDF8] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold text-[#45372F] tracking-tight">
                  Kopi Duit
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9C66A]/20 text-[#755B03] border border-[#E9C66A]/40">
                  <Flame size={12} className="text-[#883C28] fill-[#883C28]" />
                  <span>{profile.streakDays} days streak</span>
                </span>
              </div>
              <p className="text-xs text-[#786E65] font-medium flex items-center gap-1.5 mt-0.5">
                <span>{todayFormatted}</span>
                <span>•</span>
                <span className="truncate max-w-[200px] sm:max-w-xs">{displayName}</span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              onClick={onOpenSplitTool}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#45372F] bg-transparent hover:bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg transition-colors cursor-pointer"
              title="Split dorm / mamak bill with roommates"
            >
              <span>🥢</span>
              <span className="hidden xs:inline">Split Bill</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#45372F] bg-[#E9C66A] hover:bg-[#fdd97b] rounded-lg transition-all transform active:scale-98 shadow-xs cursor-pointer border border-[#dac1bb]/50"
              title="Export Month"
            >
              <Download size={14} className="text-[#45372F]" />
              <span className="hidden sm:inline">Export Month</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#FFFDF8] bg-[#A6533D] hover:bg-[#8E4330] rounded-lg transition-all transform hover:scale-[1.01] active:scale-95 shadow-cozy-1 cursor-pointer"
            >
              <Plus size={16} />
              <span>Log Spend</span>
            </button>

            {/* Profile Avatar & Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#E8DFD1]">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={displayName}
                    className="w-7 h-7 rounded-full border border-[#E8DFD1] object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FFEADF] text-[#883C28] text-xs font-bold flex items-center justify-center border border-[#DAC1BB]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onSignOut}
                  className="p-1.5 rounded-lg text-[#786E65] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
