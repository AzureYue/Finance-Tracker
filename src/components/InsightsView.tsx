import React, { useMemo } from 'react';
import { Sparkles, PieChart, TrendingUp, Award, Compass, AlertCircle, Coffee, Heart } from 'lucide-react';
import { Transaction, Category, BudgetConfig } from '../types';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CatPawWatermark } from './CatPawWatermark';

interface InsightsViewProps {
  transactions: Transaction[];
  categories: Category[];
  budgetConfig: BudgetConfig;
  currency?: string;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  transactions,
  categories,
  budgetConfig,
  currency = 'RM',
}) => {
  // Category spending breakdown
  const categoryStats = useMemo(() => {
    const map: { [catId: string]: { name: string; emoji: string; color: string; bgTint: string; total: number; count: number } } = {};

    for (const cat of categories) {
      if (cat.type === 'expense') {
        map[cat.id] = {
          name: cat.name,
          emoji: cat.emoji,
          color: cat.color,
          bgTint: cat.bgTint,
          total: 0,
          count: 0,
        };
      }
    }

    for (const t of transactions) {
      if (t.type === 'expense') {
        const amt = t.splitWithRoommate && t.myShare ? t.myShare : t.amount;
        if (!map[t.categoryId]) {
          map[t.categoryId] = {
            name: 'Other',
            emoji: '🏷️',
            color: '#88726D',
            bgTint: '#FFEADF',
            total: 0,
            count: 0,
          };
        }
        map[t.categoryId].total += amt;
        map[t.categoryId].count += 1;
      }
    }

    const totalExpenseAll = Object.values(map).reduce((s, c) => s + c.total, 0);

    return Object.entries(map)
      .map(([id, data]) => ({
        id,
        ...data,
        percentage: totalExpenseAll > 0 ? (data.total / totalExpenseAll) * 100 : 0,
      }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions, categories]);

  // Day of week spending
  const dayOfWeekSpend = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sums = [0, 0, 0, 0, 0, 0, 0];

    for (const t of transactions) {
      if (t.type === 'expense') {
        const d = new Date(t.date).getDay();
        const amt = t.splitWithRoommate && t.myShare ? t.myShare : t.amount;
        sums[d] += amt;
      }
    }

    const max = Math.max(...sums, 1);
    return days.map((day, i) => ({
      day,
      sum: sums[i],
      ratio: (sums[i] / max) * 100,
    }));
  }, [transactions]);

  // Total expenses and inflows
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + (t.splitWithRoommate && t.myShare ? t.myShare : t.amount), 0);

  const totalInflows = transactions
    .filter((t) => t.type === 'inflow')
    .reduce((s, t) => s + t.amount, 0);

  // Student Health Score (0 - 100)
  const healthScore = Math.min(
    100,
    Math.max(
      40,
      Math.round(100 - (totalExpenses / (budgetConfig.monthlyAllowance || 1)) * 40)
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#45372F] flex items-center gap-2">
          <span>🐾</span> Kopi's Cozy Campus Insights
        </h2>
        <p className="text-xs text-[#786E65] mt-0.5">
          Whimsical analysis of your dining, boba breaks, and campus life rhythm.
        </p>
      </div>

      {/* Top Banner: Student Health & Mascots */}
      <div className="relative bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 sm:p-6 shadow-cozy-1 overflow-hidden">
        <CatPawWatermark className="absolute -bottom-4 -right-4" size={140} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F0DA] border border-[#7A8471]/30 flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <span className="text-2xl">🐱</span>
              <span className="text-[10px] font-extrabold text-[#4C5645] mt-0.5">
                {healthScore}/100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#45372F]">
                  Student Financial Vitality: Cozy & Mindful
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#E9C66A]/20 text-[#755B03] font-bold">
                  Top 10%
                </span>
              </div>
              <p className="text-xs text-[#786E65] mt-1 max-w-xl leading-relaxed">
                You've consistently logged your meals and maintained a safe daily spend margin.
                Your allowance is pacing well toward finals week!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#786E65] block uppercase">
                Net Savings Rate
              </span>
              <span className="text-lg font-extrabold text-[#7A8471] tabular-numbers">
                {totalInflows > 0 ? Math.round(((totalInflows - totalExpenses) / totalInflows) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown + Day of Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Card */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#45372F] flex items-center gap-1.5 uppercase tracking-wider">
              <PieChart size={15} className="text-[#A6533D]" /> Spending by Category
            </h3>
            <span className="text-xs font-semibold text-[#786E65]">
              {categoryStats.length} active categories
            </span>
          </div>

          {/* Stacked colored distribution bar */}
          <div className="h-3.5 w-full bg-[#E8DFD1]/50 rounded-full flex overflow-hidden">
            {categoryStats.map((cat) => (
              <div
                key={cat.id}
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
                title={`${cat.name}: ${cat.percentage.toFixed(1)}%`}
                className="h-full transition-all duration-500 hover:brightness-110"
              />
            ))}
          </div>

          {/* Category detail rows */}
          <div className="space-y-2.5 pt-1">
            {categoryStats.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F0E6]/50 border border-[#E8DFD1]/50 hover:bg-[#F5F0E6] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{cat.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-[#45372F] block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#786E65]">
                      {cat.count} {cat.count === 1 ? 'transaction' : 'transactions'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <CurrencyDisplay
                    amount={cat.total}
                    prefix={currency}
                    size="md"
                    colorScheme="espresso"
                  />
                  <span className="text-[10px] font-bold text-[#786E65] block">
                    {Math.round(cat.percentage)}% of spend
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day of Week Spending + Campus Whispers */}
        <div className="space-y-6">
          {/* Day of week bars */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#45372F] flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp size={15} className="text-[#E9C66A]" /> Campus Weekly Rhythm
              </h3>
              <span className="text-xs text-[#786E65]">Spending by day</span>
            </div>

            <div className="flex items-end justify-between h-32 pt-4 px-2">
              {dayOfWeekSpend.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold text-[#786E65] tabular-numbers">
                    {d.sum > 0 ? `${Math.round(d.sum)}` : ''}
                  </span>
                  <div className="w-6 sm:w-8 bg-[#F5F0E6] rounded-t-md h-20 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-[#A6533D] rounded-t-md transition-all duration-500 hover:bg-[#8E4330]"
                      style={{ height: `${Math.max(d.ratio, d.sum > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#45372F]">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#786E65] text-center italic">
              Notice: Weekday lunch expenses are consistent, with lower leisure spending on study Sundays!
            </p>
          </div>

          {/* Kopi's Campus Whispers Card */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 space-y-3">
            <h3 className="text-sm font-bold text-[#45372F] flex items-center gap-2">
              <span>🐱☕</span> Kopi's Campus Whispers
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#FFEADF]/70 border border-[#DAC1BB] flex gap-2.5">
                <span className="text-lg shrink-0">🧋</span>
                <p className="text-[#45372F] leading-relaxed">
                  <strong>Boba & Treats check:</strong> You spent {currency} 14.90 on Tealive. Switching 1 milk tea per week to dorm iced tea saves ~{currency} 60 per month for your Penang trip jar!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#E6F0DA]/70 border border-[#C0CAB4] flex gap-2.5">
                <span className="text-lg shrink-0">📚</span>
                <p className="text-[#45372F] leading-relaxed">
                  <strong>Photostat pro-tip:</strong> Double-sided printing in the campus co-op saves 30% compared to off-campus shops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F0E6] border border-[#E8DFD1] flex gap-2.5">
                <span className="text-lg shrink-0">🍲</span>
                <p className="text-[#45372F] leading-relaxed">
                  <strong>Mamak study sessions:</strong> Roti canai + teh tarik remains the ultimate student value meal under {currency} 6.50.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
