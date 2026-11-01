import React, { useState, useMemo } from 'react';
import { Target, Shield, AlertTriangle, Coffee, BookOpen, Utensils, TrainTrack, Sparkles, CheckCircle2 } from 'lucide-react';
import { BudgetConfig, Category, Transaction } from '../types';
import { WhiskerProgressBar } from './WhiskerProgressBar';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CatPawWatermark } from './CatPawWatermark';

interface BudgetWalletsViewProps {
  budgetConfig: BudgetConfig;
  categories: Category[];
  transactions: Transaction[];
  currency?: string;
  onUpdateBudgetConfig: (config: BudgetConfig) => void;
  onUpdateCategoryBudget: (categoryId: string, newBudget: number) => void;
}

export const BudgetWalletsView: React.FC<BudgetWalletsViewProps> = ({
  budgetConfig,
  categories,
  transactions,
  currency = 'RM',
  onUpdateBudgetConfig,
  onUpdateCategoryBudget,
}) => {
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [allowanceInput, setAllowanceInput] = useState(budgetConfig.monthlyAllowance.toString());
  const [fixedCostsInput, setFixedCostsInput] = useState(budgetConfig.fixedCosts.toString());
  const [dailyTargetInput, setDailyTargetInput] = useState(budgetConfig.dailySafeTarget.toString());

  // Current month prefix e.g. "2026-10"
  const currentMonth = new Date().toISOString().substring(0, 7);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const remainingDaysInMonth = Math.max(1, daysInMonth - currentDay + 1);

  // Month transactions
  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonth)),
    [transactions, currentMonth]
  );

  // Category spending map
  const categorySpending = useMemo(() => {
    const map: { [catId: string]: number } = {};
    for (const t of monthTransactions) {
      if (t.type === 'expense') {
        const amt = t.splitWithRoommate && t.myShare ? t.myShare : t.amount;
        map[t.categoryId] = (map[t.categoryId] || 0) + amt;
      }
    }
    return map;
  }, [monthTransactions]);

  // Overall calculations
  const totalSpentThisMonth = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const flexiblePool = Math.max(0, budgetConfig.monthlyAllowance - budgetConfig.fixedCosts);
  const calculatedSafeDaily = Math.max(0, (flexiblePool - totalSpentThisMonth) / remainingDaysInMonth);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBudgetConfig({
      ...budgetConfig,
      monthlyAllowance: parseFloat(allowanceInput) || 1200,
      fixedCosts: parseFloat(fixedCostsInput) || 300,
      dailySafeTarget: parseFloat(dailyTargetInput) || 30,
    });
    setIsEditingConfig(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#45372F] flex items-center gap-2">
            <span>🐾</span> Safe-to-Spend & Budget Wallets
          </h2>
          <p className="text-xs text-[#786E65] mt-0.5">
            Keep your semester allowance calm, steady, and anxiety-free with gentle daily guardrails.
          </p>
        </div>

        <button
          onClick={() => setIsEditingConfig(!isEditingConfig)}
          className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-bold text-[#45372F] bg-[#FFFDF8] hover:bg-[#FBE4D8] border border-[#E8DFD1] rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          {isEditingConfig ? 'Cancel Editing' : '⚙️ Adjust Allowance & Fixed Costs'}
        </button>
      </div>

      {/* Edit Config Drawer/Card if open */}
      {isEditingConfig && (
        <form
          onSubmit={handleSaveConfig}
          className="bg-[#FFFDF8] border border-[#E8DFD1] rounded-2xl p-5 shadow-cozy-2 space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-bold text-[#45372F] flex items-center gap-1.5">
            <Sparkles size={16} className="text-[#E9C66A]" /> Update Budget Framework
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#786E65] block mb-1">
                Monthly Allowance / Income ({currency})
              </label>
              <input
                type="number"
                step="10"
                value={allowanceInput}
                onChange={(e) => setAllowanceInput(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-sm font-bold text-[#45372F]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#786E65] block mb-1">
                Fixed Costs (Dorm, WiFi, Passes)
              </label>
              <input
                type="number"
                step="5"
                value={fixedCostsInput}
                onChange={(e) => setFixedCostsInput(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-sm font-bold text-[#45372F]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#786E65] block mb-1">
                Preferred Daily Target ({currency})
              </label>
              <input
                type="number"
                step="1"
                value={dailyTargetInput}
                onChange={(e) => setDailyTargetInput(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-sm font-bold text-[#45372F]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DFD1]">
            <button
              type="button"
              onClick={() => setIsEditingConfig(false)}
              className="px-3 py-1.5 text-xs font-bold text-[#786E65] hover:text-[#45372F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-[#FFFDF8] bg-[#A6533D] hover:bg-[#8E4330] rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Main Breakdown Overview Card */}
      <div className="relative bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 sm:p-6 shadow-cozy-1 overflow-hidden">
        <CatPawWatermark className="absolute -bottom-3 -right-3" size={130} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#786E65]">
              Semester Monthly Health
            </span>
            <div className="flex items-baseline gap-2">
              <CurrencyDisplay
                amount={totalSpentThisMonth}
                prefix={currency}
                size="display"
                colorScheme="espresso"
              />
              <span className="text-sm font-semibold text-[#786E65]">
                / {currency} {flexiblePool.toFixed(2)} flexible pool
              </span>
            </div>

            <p className="text-xs text-[#786E65] leading-relaxed">
              After reserving <strong>{currency} {budgetConfig.fixedCosts.toFixed(2)}</strong> for dorm rent, campus Wi-Fi & transportation pass, you have{' '}
              <strong className="text-[#45372F]">{currency} {Math.max(0, flexiblePool - totalSpentThisMonth).toFixed(2)}</strong> remaining for the next {remainingDaysInMonth} days of the month.
            </p>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-1 text-[#45372F]">
                <span>Overall Spent: {Math.round((totalSpentThisMonth / (flexiblePool || 1)) * 100)}%</span>
                <span className="text-[#786E65]">{remainingDaysInMonth} days remaining in October</span>
              </div>
              <WhiskerProgressBar
                progress={(totalSpentThisMonth / (flexiblePool || 1)) * 100}
                variant="dynamic"
                milestones={[50, 80]}
              />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-3 border-t md:border-t-0 md:border-l border-[#E8DFD1]/80 pt-4 md:pt-0 md:pl-6">
            <div className="p-3.5 rounded-xl bg-[#F5F0E6] border border-[#E8DFD1] flex flex-col justify-between">
              <span className="text-[11px] font-bold text-[#786E65] uppercase">
                Dynamic Daily Cap
              </span>
              <div className="my-1">
                <CurrencyDisplay
                  amount={calculatedSafeDaily}
                  prefix={currency}
                  size="xl"
                  colorScheme={calculatedSafeDaily > 20 ? 'matcha' : 'terracotta'}
                />
              </div>
              <span className="text-[11px] text-[#786E65]">
                Paced for remaining {remainingDaysInMonth} days
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F0E6] border border-[#E8DFD1] flex flex-col justify-between">
              <span className="text-[11px] font-bold text-[#786E65] uppercase">
                Fixed Commitments
              </span>
              <div className="my-1">
                <CurrencyDisplay
                  amount={budgetConfig.fixedCosts}
                  prefix={currency}
                  size="xl"
                  colorScheme="espresso"
                />
              </div>
              <span className="text-[11px] text-[#786E65]">
                Dorm rent, utilities & LRT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#45372F] uppercase tracking-wider">
            Category Spending Limits
          </h3>
          <span className="text-xs text-[#786E65]">
            Click slider to adjust limits
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .filter((c) => c.type === 'expense' || c.budgetMonthly)
            .map((cat) => {
              const spent = categorySpending[cat.id] || 0;
              const budget = cat.budgetMonthly || 100;
              const percent = Math.min((spent / budget) * 100, 100);
              const remaining = budget - spent;
              const isOver = spent > budget;
              const isNearing = percent >= 80 && !isOver;

              return (
                <div
                  key={cat.id}
                  className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-4 shadow-cozy-1 flex flex-col justify-between hover:border-[#DAC1BB] transition-all"
                >
                  <div>
                    {/* Header: Icon, Name, Alert Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm border border-[#E8DFD1]/50"
                          style={{ backgroundColor: cat.bgTint }}
                        >
                          <span>{cat.emoji}</span>
                        </div>
                        <span className="text-sm font-bold text-[#45372F]">
                          {cat.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOver
                            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                            : isNearing
                            ? 'bg-[#FFDF91] text-[#755B03]'
                            : 'bg-[#E6F0DA] text-[#4C5645]'
                        }`}
                      >
                        {isOver ? 'Exceeded ⚠️' : isNearing ? 'Nearing Limit 🐾' : 'Safe 🍃'}
                      </span>
                    </div>

                    {/* Spend vs Limit */}
                    <div className="flex items-baseline justify-between mb-1">
                      <CurrencyDisplay
                        amount={spent}
                        prefix={currency}
                        size="lg"
                        colorScheme={isOver ? 'terracotta' : 'espresso'}
                      />
                      <span className="text-xs font-semibold text-[#786E65]">
                        cap: {currency} {budget}
                      </span>
                    </div>

                    {/* Whiskered Progress Bar */}
                    <WhiskerProgressBar
                      progress={percent}
                      variant={isOver ? 'terracotta' : isNearing ? 'ochre' : 'matcha'}
                      milestones={[50, 80]}
                    />

                    <div className="flex items-center justify-between text-[11px] text-[#786E65] mt-1 font-medium">
                      <span>{Math.round(percent)}% spent</span>
                      <span className={remaining >= 0 ? 'text-[#7A8471]' : 'text-[#BA1A1A]'}>
                        {remaining >= 0 ? `${currency} ${remaining.toFixed(2)} left` : `Over by ${currency} ${Math.abs(remaining).toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Quick Budget Adjust Slider */}
                  <div className="mt-4 pt-3 border-t border-[#E8DFD1]/60 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#786E65] shrink-0">
                      Cap:
                    </span>
                    <input
                      type="range"
                      min="20"
                      max="800"
                      step="10"
                      value={budget}
                      onChange={(e) => onUpdateCategoryBudget(cat.id, Number(e.target.value))}
                      className="w-full accent-[#A6533D] h-1.5 bg-[#F5F0E6] rounded-lg cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-[#45372F] w-12 text-right tabular-numbers">
                      {budget}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
