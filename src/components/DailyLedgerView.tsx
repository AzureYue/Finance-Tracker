import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { Transaction, Category, BudgetConfig } from '../types';
import { TransactionItem } from './TransactionItem';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CatPawWatermark } from './CatPawWatermark';
import { WhiskerProgressBar } from './WhiskerProgressBar';
import { SleepingCatEmptyState } from './SleepingCatEmptyState';

interface DailyLedgerViewProps {
  transactions: Transaction[];
  categories: Category[];
  budgetConfig: BudgetConfig;
  currency?: string;
  onDeleteTransaction: (id: string) => void;
  onOpenQuickAdd: () => void;
}

export const DailyLedgerView: React.FC<DailyLedgerViewProps> = ({
  transactions,
  categories,
  budgetConfig,
  currency = 'RM',
  onDeleteTransaction,
  onOpenQuickAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'inflow'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days'>('all');

  // Today ISO
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today's calculations
  const todayTransactions = useMemo(
    () => transactions.filter((t) => t.date === todayStr),
    [transactions, todayStr]
  );

  const todaySpent = useMemo(
    () =>
      todayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (t.splitWithRoommate && t.myShare ? t.myShare : t.amount), 0),
    [todayTransactions]
  );

  // Month-to-date calculations
  const currentMonthPrefix = todayStr.substring(0, 7); // e.g. "2026-10"
  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonthPrefix)),
    [transactions, currentMonthPrefix]
  );

  const monthExpenses = useMemo(
    () =>
      monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (t.splitWithRoommate && t.myShare ? t.myShare : t.amount), 0),
    [monthTransactions]
  );

  const monthInflow = useMemo(
    () =>
      monthTransactions
        .filter((t) => t.type === 'inflow')
        .reduce((sum, t) => sum + t.amount, 0),
    [monthTransactions]
  );

  const netBalance = monthInflow - monthExpenses;
  const dailyRemaining = budgetConfig.dailySafeTarget - todaySpent;
  const todayProgressPercent = (todaySpent / (budgetConfig.dailySafeTarget || 1)) * 100;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type filter
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // Category filter
      if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;

      // Date filter
      if (dateFilter === 'today' && t.date !== todayStr) return false;
      if (dateFilter === '7days') {
        const txDate = new Date(t.date).getTime();
        const cutoff = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
        if (txDate < cutoff) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesMerchant = t.merchant.toLowerCase().includes(query);
        const matchesNote = t.note ? t.note.toLowerCase().includes(query) : false;
        const cat = categories.find((c) => c.id === t.categoryId);
        const matchesCat = cat ? cat.name.toLowerCase().includes(query) : false;
        if (!matchesMerchant && !matchesNote && !matchesCat) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, selectedCategory, dateFilter, searchTerm, todayStr, categories]);

  // Group filtered transactions by date (descending)
  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};
    for (const t of filteredTransactions) {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    }

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    return sortedDates.map((date) => {
      const items = groups[date];
      const dayTotalExpense = items
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + (t.splitWithRoommate && t.myShare ? t.myShare : t.amount), 0);
      const dayTotalInflow = items
        .filter((t) => t.type === 'inflow')
        .reduce((s, t) => s + t.amount, 0);

      return {
        date,
        items,
        dayTotalExpense,
        dayTotalInflow,
      };
    });
  }, [filteredTransactions]);

  const formatDateHeader = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today, ' + new Intl.DateTimeFormat('en-MY', { day: 'numeric', month: 'short' }).format(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (dateStr === yesterdayStr) return 'Yesterday, ' + new Intl.DateTimeFormat('en-MY', { day: 'numeric', month: 'short' }).format(yesterday);

    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-MY', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  };

  return (
    <div className="space-y-6">
      {/* Top Financial Summary Cards: Level 1 Elevation, Milk Surface, Cat Paw Watermark */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Safe-to-Spend Today */}
        <div className="relative overflow-hidden bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 flex flex-col justify-between">
          <CatPawWatermark className="absolute -bottom-2 -right-2" size={90} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#786E65] flex items-center gap-1.5">
                <span>🐾</span> Safe-to-Spend Today
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  dailyRemaining >= 0
                    ? 'bg-[#E6F0DA] text-[#4C5645]'
                    : 'bg-[#FFDAD6] text-[#BA1A1A]'
                }`}
              >
                {dailyRemaining >= 0 ? 'Safe Zone 🍃' : 'Budget Exceeded ⚠️'}
              </span>
            </div>

            <div className="mt-1">
              <CurrencyDisplay
                amount={dailyRemaining}
                prefix={currency}
                size="display"
                colorScheme={dailyRemaining >= 0 ? 'matcha' : 'terracotta'}
              />
              <span className="text-xs font-semibold text-[#786E65] block mt-0.5">
                remaining of {currency} {budgetConfig.dailySafeTarget.toFixed(2)} daily target
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#E8DFD1]/60">
            <div className="flex items-center justify-between text-xs text-[#786E65] mb-1 font-medium">
              <span>Today's Spend: {currency} {todaySpent.toFixed(2)}</span>
              <span>{Math.round(todayProgressPercent)}%</span>
            </div>
            <WhiskerProgressBar
              progress={todayProgressPercent}
              variant="dynamic"
              milestones={[50, 80]}
            />
          </div>
        </div>

        {/* Card 2: October Monthly Spend vs Allowance */}
        <div className="relative overflow-hidden bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 flex flex-col justify-between">
          <CatPawWatermark className="absolute -bottom-2 -right-2" size={90} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#786E65] flex items-center gap-1.5">
                <TrendingDown size={14} className="text-[#A6533D]" /> Month Total Spent
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFEADF] text-[#883C28]">
                October Ledger
              </span>
            </div>

            <div className="mt-1">
              <CurrencyDisplay
                amount={monthExpenses}
                prefix={currency}
                size="display"
                colorScheme="espresso"
              />
              <span className="text-xs font-semibold text-[#786E65] block mt-0.5">
                recorded across campus canteen & treats
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#E8DFD1]/60 flex items-center justify-between text-xs">
            <span className="text-[#786E65]">Allowance received:</span>
            <span className="font-bold text-[#7A8471] tabular-numbers">
              +{currency} {monthInflow.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 3: Surplus / Net Student Balance */}
        <div className="relative overflow-hidden bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 shadow-cozy-1 flex flex-col justify-between">
          <CatPawWatermark className="absolute -bottom-2 -right-2" size={90} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#786E65] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#7A8471]" /> Available Cash Surplus
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9C66A]/25 text-[#755B03]">
                Cozy Cushion
              </span>
            </div>

            <div className="mt-1">
              <CurrencyDisplay
                amount={netBalance}
                prefix={currency}
                sign={netBalance >= 0 ? '+' : '-'}
                size="display"
                colorScheme={netBalance >= 0 ? 'matcha' : 'terracotta'}
              />
              <span className="text-xs font-semibold text-[#786E65] block mt-0.5">
                {netBalance >= 0
                  ? 'Ready to toss into savings jars! 🐾'
                  : 'Tighten coffee budget for end of term'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#E8DFD1]/60 flex items-center justify-between text-xs">
            <span className="text-[#786E65]">Dorm Fixed Costs reserved:</span>
            <span className="font-bold text-[#45372F] tabular-numbers">
              {currency} {budgetConfig.fixedCosts.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-4 shadow-cozy-1 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786E65]"
            />
            <input
              type="text"
              placeholder="Search canteen, Tealive, photostat, note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl text-xs font-medium text-[#45372F] outline-none focus:ring-2 focus:ring-[#A6533D]/25 focus:border-[#A6533D] placeholder:text-[#88726D]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#786E65] hover:text-[#45372F]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type tabs (All / Expenses / Inflow) */}
          <div className="flex items-center rounded-xl bg-[#F5F0E6] p-1 border border-[#E8DFD1] self-start sm:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[#FFFDF8] text-[#45372F] shadow-xs'
                  : 'text-[#786E65] hover:text-[#45372F]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-[#A6533D] text-[#FFFDF8] shadow-xs'
                  : 'text-[#786E65] hover:text-[#45372F]'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('inflow')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'inflow'
                  ? 'bg-[#7A8471] text-[#FFFDF8] shadow-xs'
                  : 'text-[#786E65] hover:text-[#45372F]'
              }`}
            >
              Allowance
            </button>
          </div>

          {/* Date range presets */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-[#FBE4D8] border-[#A6533D] text-[#883C28]'
                  : 'border-[#E8DFD1] text-[#786E65] hover:bg-[#F5F0E6]'
              }`}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-[#FBE4D8] border-[#A6533D] text-[#883C28]'
                  : 'border-[#E8DFD1] text-[#786E65] hover:bg-[#F5F0E6]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                dateFilter === '7days'
                  ? 'bg-[#FBE4D8] border-[#A6533D] text-[#883C28]'
                  : 'border-[#E8DFD1] text-[#786E65] hover:bg-[#F5F0E6]'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>

        {/* Category Filter Chips: Soft pill shape, height 28px */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#A6533D] text-[#FFFDF8] shadow-xs'
                : 'bg-[#F5F0E6] text-[#45372F] hover:bg-[#DAC1BB]/40 border border-[#E8DFD1]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#A6533D] font-bold shadow-xs'
                    : 'border border-[#E8DFD1] hover:brightness-95'
                }`}
                style={{
                  backgroundColor: cat.bgTint,
                  color: '#45372F',
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Transactions List */}
      {groupedTransactions.length === 0 ? (
        <SleepingCatEmptyState
          title={
            searchTerm || selectedCategory !== 'all' || dateFilter !== 'all'
              ? 'No matching entries found.'
              : 'Purr-fect! No expenses logged yet today.'
          }
          subtitle={
            searchTerm || selectedCategory !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your search terms or filters to reveal past transactions.'
              : 'Take a deep breath, enjoy your coffee or campus stroll. Your student wallet is at rest.'
          }
          actionText="Log a quick coffee or lunch"
          onAction={onOpenQuickAdd}
        />
      ) : (
        <div className="space-y-6">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-2.5">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#45372F]">
                    {formatDateHeader(group.date)}
                  </span>
                  <span className="text-xs text-[#786E65] font-medium">
                    ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold tabular-numbers">
                  {group.dayTotalExpense > 0 && (
                    <span className="text-[#45372F]">
                      Spent: <span className="text-[#A6533D]">-{currency} {group.dayTotalExpense.toFixed(2)}</span>
                    </span>
                  )}
                  {group.dayTotalInflow > 0 && (
                    <span className="text-[#7A8471]">
                      +{currency} {group.dayTotalInflow.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Transactions in this day */}
              <div className="space-y-2">
                {group.items.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    category={categories.find((c) => c.id === tx.categoryId)}
                    currency={currency}
                    onDelete={onDeleteTransaction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
