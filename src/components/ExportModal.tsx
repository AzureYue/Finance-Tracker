import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, Check, Printer } from 'lucide-react';
import { Transaction, Category, BudgetConfig, StudentProfile } from '../types';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CatPawWatermark } from './CatPawWatermark';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  budgetConfig: BudgetConfig;
  profile: StudentProfile;
  currency?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
  budgetConfig,
  profile,
  currency = 'RM',
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));
  const monthExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + (t.splitWithRoommate && t.myShare ? t.myShare : t.amount), 0);
  const monthInflow = monthTransactions
    .filter((t) => t.type === 'inflow')
    .reduce((s, t) => s + t.amount, 0);

  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Type', 'Category', 'Merchant', 'Amount', 'Currency', 'My Share', 'Note'];
    const rows = monthTransactions.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId)?.name || 'General';
      return [
        t.date,
        t.time,
        t.type,
        `"${cat}"`,
        `"${t.merchant.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        currency,
        t.myShare ? t.myShare.toFixed(2) : '',
        `"${(t.note || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Ledger_${currentMonth}_${profile.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedFormat('csv');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      month: currentMonth,
      profile,
      summary: {
        totalExpenses: monthExpenses,
        totalInflow: monthInflow,
        netSurplus: monthInflow - monthExpenses,
        transactionsCount: monthTransactions.length,
      },
      transactions: monthTransactions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Student_Ledger_Backup_${currentMonth}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadedFormat('json');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251912]/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 sm:p-6 w-full max-w-lg shadow-cozy-3 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="font-bold text-base text-[#45372F]">
                Export Monthly Ledger
              </h3>
              <p className="text-xs text-[#786E65]">
                Download your student spending records for budgeting, parents, or archives.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#786E65] hover:text-[#45372F] p-1 rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Summary Snapshot Card */}
        <div className="relative p-4 rounded-xl bg-[#F5F0E6] border border-[#E8DFD1] overflow-hidden">
          <CatPawWatermark className="absolute -bottom-2 -right-2" size={90} />
          <div className="flex items-center justify-between text-xs font-bold text-[#786E65] uppercase">
            <span>October 2026 Snapshot</span>
            <span>{profile.name} • {profile.campus}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#DAC1BB]">
            <div>
              <span className="text-[10px] text-[#786E65] block font-semibold">Total Spent</span>
              <CurrencyDisplay amount={monthExpenses} prefix={currency} size="md" colorScheme="espresso" />
            </div>
            <div>
              <span className="text-[10px] text-[#786E65] block font-semibold">Allowance</span>
              <CurrencyDisplay amount={monthInflow} prefix={currency} size="md" colorScheme="matcha" />
            </div>
            <div>
              <span className="text-[10px] text-[#786E65] block font-semibold">Logged Entries</span>
              <span className="text-base font-bold text-[#45372F] tabular-numbers">{monthTransactions.length}</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CSV */}
          <button
            onClick={handleExportCSV}
            className="p-4 rounded-xl border border-[#E8DFD1] hover:border-[#DAC1BB] bg-[#FFFDF8] hover:bg-[#FAF6EE] text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <FileSpreadsheet size={20} className="text-[#7A8471]" />
              {downloadedFormat === 'csv' && (
                <span className="text-[10px] font-bold text-[#7A8471] bg-[#E6F0DA] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check size={11} /> Downloaded
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-[#45372F] group-hover:text-[#A6533D]">
              Spreadsheet (CSV)
            </h4>
            <p className="text-[11px] text-[#786E65] mt-0.5">
              Ideal for Google Sheets, Excel, or sharing with parents
            </p>
          </button>

          {/* JSON */}
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-xl border border-[#E8DFD1] hover:border-[#DAC1BB] bg-[#FFFDF8] hover:bg-[#FAF6EE] text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText size={20} className="text-[#A6533D]" />
              {downloadedFormat === 'json' && (
                <span className="text-[10px] font-bold text-[#7A8471] bg-[#E6F0DA] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check size={11} /> Saved
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-[#45372F] group-hover:text-[#A6533D]">
              Full Data Backup (JSON)
            </h4>
            <p className="text-[11px] text-[#786E65] mt-0.5">
              Complete raw ledger record with timestamps and tags
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8DFD1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#45372F] bg-[#E9C66A] hover:bg-[#FDD97B] rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
