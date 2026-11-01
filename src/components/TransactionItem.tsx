import React from 'react';
import { Trash2, Users, FileText } from 'lucide-react';
import { Transaction, Category } from '../types';
import { CurrencyDisplay } from './CurrencyDisplay';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  currency?: string;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  currency = 'RM',
  onDelete,
}) => {
  const isExpense = transaction.type === 'expense';
  const categoryEmoji = category?.emoji || (isExpense ? '💸' : '💵');
  const categoryName = category?.name || (isExpense ? 'Expense' : 'Inflow');
  const categoryColor = category?.color || (isExpense ? '#A6533D' : '#7A8471');
  const categoryBg = category?.bgTint || (isExpense ? '#FFEADF' : '#E6F0DA');

  return (
    <div className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border border-[#E8DFD1]/80 hover:border-[#DAC1BB] hover:shadow-cozy-1 transition-all">
      {/* Left: Category Circle Icon + Details */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 mr-3">
        {/* Category Circle Icon */}
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 border border-[#E8DFD1]/50 text-lg transition-transform group-hover:scale-105"
          style={{ backgroundColor: categoryBg, color: categoryColor }}
        >
          <span>{categoryEmoji}</span>
        </div>

        {/* Center: Merchant, Timestamp, Category badge, Note */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-[#45372F] truncate font-sans">
              {transaction.merchant}
            </h4>

            {/* Soft pill category badge with 12% opacity background */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-black/5"
              style={{
                backgroundColor: categoryBg,
                color: '#45372F',
              }}
            >
              <span>{categoryEmoji}</span>
              <span>{categoryName}</span>
            </span>

            {transaction.splitWithRoommate && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FAF6EE] text-[#786E65] border border-[#E8DFD1]">
                <Users size={11} className="text-[#A6533D]" />
                <span>Split ({transaction.roommateCount || 2})</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#786E65]">
            <span className="font-medium">{transaction.time}</span>
            {transaction.note && (
              <>
                <span>•</span>
                <span className="truncate max-w-[220px] sm:max-w-md italic text-[#786E65]/90">
                  {transaction.note}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Tabulated Currency & Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <CurrencyDisplay
            amount={transaction.amount}
            prefix={currency}
            sign={isExpense ? '-' : '+'}
            size="lg"
            colorScheme={isExpense ? 'espresso' : 'matcha'}
          />
          {transaction.splitWithRoommate && transaction.myShare && (
            <div className="text-[11px] font-semibold text-[#A6533D] tabular-numbers">
              My share: {currency} {transaction.myShare.toFixed(2)}
            </div>
          )}
        </div>

        {/* Delete action visible on hover or focus */}
        <button
          onClick={() => onDelete(transaction.id)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-[#786E65] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-all cursor-pointer"
          title="Delete transaction"
          aria-label="Delete transaction"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};
