
import React from 'react';
import { BookOpen, Target, Sparkles, ReceiptText } from 'lucide-react';

export type TabId = 'ledger' | 'budgets' | 'insights';

interface NavigationRailProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  unloggedTodayCount?: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'ledger' as TabId, label: 'Daily Ledger', icon: BookOpen, emoji: '📖' },
    { id: 'budgets' as TabId, label: 'Budget Wallets', icon: Target, emoji: '🎯' },
    { id: 'insights' as TabId, label: "Kopi's Whispers", icon: Sparkles, emoji: '🐾' },
  ];

  return (
    <>
      {/* Desktop / Tablet Left Docked Rail (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-20 self-start space-y-5 py-2">
        {/* Navigation list */}
        <nav className="space-y-1.5 bg-[#FFFDF8] p-2.5 rounded-2xl border border-[#E8DFD1] shadow-cozy-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-[#E9C66A]/25 text-[#45372F] border border-[#E9C66A]'
                    : 'text-[#786E65] hover:text-[#45372F] hover:bg-[#F5F0E6]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#E9C66A] text-[#45372F]' : 'bg-[#F5F0E6] text-[#786E65] group-hover:text-[#45372F]'
                  }`}
                >
                  <Icon size={15} />
                </div>
                <span className="flex-1 font-sans">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6533D]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mascot Cozy Desk Widget */}
        <div className="bg-[#FAF6EE] border border-[#E8DFD1] rounded-2xl p-3.5 text-center relative overflow-hidden shadow-2xs">
          <span className="text-2xl block mb-1">🍵🐱</span>
          <h4 className="text-xs font-bold text-[#45372F]">Kopi's Dorm Corner</h4>
          <p className="text-[11px] text-[#786E65] mt-1 leading-snug">
            "Remember to hydrate between study sessions, friend!"
          </p>
        </div>
      </aside>

      {/* Mobile Bottom App Bar (visible only on screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#E8DFD1] px-2 py-1.5 shadow-cozy-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#A6533D] font-bold'
                    : 'text-[#786E65] hover:text-[#45372F]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg mb-0.5 transition-colors ${
                    isActive ? 'bg-[#FFEADF] text-[#A6533D]' : 'bg-transparent'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] leading-tight tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
