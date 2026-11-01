import React, { useState } from 'react';
import { X, Plus, Users, Calendar, Clock, Sparkles } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onAddCategory: (category: Category) => void;
  currency?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddTransaction,
  onAddCategory,
  currency = 'RM',
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('mamak');
  const [merchant, setMerchant] = useState<string>('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [note, setNote] = useState<string>('');
  const [splitWithRoommate, setSplitWithRoommate] = useState<boolean>(false);
  const [roommateCount, setRoommateCount] = useState<number>(2);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  
  // Custom category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🐾');
  const [newCatBudget, setNewCatBudget] = useState('100');

  if (!isOpen) return null;

  const quickAmounts = type === 'expense' ? [5, 10, 15, 20, 50] : [50, 100, 200, 500, 1000];
  
  const studentMerchantSuggestions = type === 'expense' 
    ? ['Hakim Mamak', 'Tealive SS15', 'RapidKL LRT', 'Campus Co-op Print Shop', 'FamilyMart', 'Uncle Soon Fried Rice', 'Zus Coffee', 'Dorm Laundromat']
    : ['Parent Living Allowance', 'Calculus Peer Tutoring', 'Part-time Library Assistant', 'Campus Hackathon Prize', 'Scholarship PTPTN'];

  const handleQuickAddAmount = (addVal: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr((current + addVal).toFixed(2).replace(/\.00$/, ''));
  };

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  );

  const numAmount = parseFloat(amountStr) || 0;
  const myCalculatedShare = splitWithRoommate && roommateCount > 0 ? numAmount / roommateCount : numAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    onAddTransaction({
      amount: numAmount,
      type,
      categoryId: selectedCategoryId || filteredCategories[0]?.id || 'mamak',
      merchant: merchant.trim() || (type === 'expense' ? 'Campus Spend' : 'Allowance Deposit'),
      date,
      time,
      note: note.trim(),
      splitWithRoommate,
      roommateCount: splitWithRoommate ? roommateCount : undefined,
      myShare: splitWithRoommate ? myCalculatedShare : undefined,
    });

    // Reset and close
    setAmountStr('');
    setMerchant('');
    setNote('');
    setSplitWithRoommate(false);
    onClose();
  };

  const handleSaveCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: `custom-${Date.now()}`,
      name: newCatName.trim(),
      iconName: 'Tag',
      emoji: newCatEmoji || '🐾',
      color: '#A6533D',
      bgTint: '#FFEADF',
      type: 'expense',
      budgetMonthly: parseFloat(newCatBudget) || 100,
      isCustom: true,
    };
    onAddCategory(newCat);
    setSelectedCategoryId(newCat.id);
    setNewCatName('');
    setShowAddCategoryModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#251912]/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] shadow-cozy-3 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD1]/60 bg-[#FFFDF8]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <h3 className="text-lg font-bold text-[#45372F]">Log New Transaction</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#786E65] hover:text-[#45372F] hover:bg-[#F5F0E6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Inflow vs Expense Selector */}
          <div className="flex rounded-xl bg-[#F5F0E6] p-1 border border-[#E8DFD1]">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (categories.find(c => c.id === 'mamak')) setSelectedCategoryId('mamak');
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-[#A6533D] text-[#FFFDF8] shadow-xs'
                  : 'text-[#786E65] hover:text-[#45372F]'
              }`}
            >
              Expense 💸
            </button>
            <button
              type="button"
              onClick={() => {
                setType('inflow');
                if (categories.find(c => c.id === 'allowance')) setSelectedCategoryId('allowance');
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                type === 'inflow'
                  ? 'bg-[#7A8471] text-[#FFFDF8] shadow-xs'
                  : 'text-[#786E65] hover:text-[#45372F]'
              }`}
            >
              Allowance & Cash In 💵
            </button>
          </div>

          {/* Amount Input with Fixed Currency Prefix */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#786E65] uppercase tracking-wider">
              Amount
            </label>
            <div className="relative flex items-center bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A6533D]/25 focus-within:border-[#A6533D] transition-all">
              <span className="text-xl sm:text-2xl font-bold text-[#786E65] mr-2 select-none">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                autoFocus
                required
                className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-[#45372F] tabular-numbers outline-none placeholder:text-[#DAC1BB]"
              />
              {amountStr && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="text-xs text-[#786E65] hover:text-[#45372F] px-2 py-1 bg-[#E8DFD1]/50 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Amount Add Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-[#786E65] mr-1">Quick add:</span>
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickAddAmount(q)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#45372F] bg-[#FFFDF8] hover:bg-[#FBE4D8] border border-[#E8DFD1] rounded-lg transition-colors cursor-pointer"
                >
                  +{currency} {q}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#786E65] uppercase tracking-wider">
                Category
              </label>
              {type === 'expense' && (
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="text-xs font-semibold text-[#883C28] hover:text-[#45372F] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Custom Category</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#A6533D] bg-[#A6533D] text-[#FFFDF8] shadow-xs'
                        : 'border-[#E8DFD1] bg-[#F5F0E6] text-[#45372F] hover:bg-[#FBE4D8]'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merchant / Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#786E65] uppercase tracking-wider">
              {type === 'expense' ? 'Where or What' : 'Source'}
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'e.g. Hakim Mamak, Tealive, RapidKL' : 'e.g. Parent Allowance, Tutoring'}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3.5 py-2.5 text-sm text-[#45372F] font-medium outline-none focus:ring-2 focus:ring-[#A6533D]/25 focus:border-[#A6533D] transition-all"
            />
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {studentMerchantSuggestions.slice(0, 4).map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setMerchant(sugg)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFFDF8] border border-[#E8DFD1] text-[#786E65] hover:text-[#45372F] hover:border-[#DAC1BB] transition-colors"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#786E65] uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2 text-xs font-medium text-[#45372F] outline-none focus:ring-2 focus:ring-[#A6533D]/25 focus:border-[#A6533D]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#786E65] uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} /> Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2 text-xs font-medium text-[#45372F] outline-none focus:ring-2 focus:ring-[#A6533D]/25 focus:border-[#A6533D]"
              />
            </div>
          </div>

          {/* Split with Roommate Toggle (Only for expenses) */}
          {type === 'expense' && (
            <div className="p-3.5 rounded-xl bg-[#F5F0E6]/60 border border-[#E8DFD1] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-[#45372F] cursor-pointer">
                  <Users size={14} className="text-[#A6533D]" />
                  <span>Split bill with dorm mates / friends</span>
                </label>
                <input
                  type="checkbox"
                  checked={splitWithRoommate}
                  onChange={(e) => setSplitWithRoommate(e.target.checked)}
                  className="w-4 h-4 rounded text-[#A6533D] accent-[#A6533D] cursor-pointer"
                />
              </div>

              {splitWithRoommate && (
                <div className="pt-2 border-t border-[#E8DFD1] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#786E65]">Number of people:</span>
                    <select
                      value={roommateCount}
                      onChange={(e) => setRoommateCount(Number(e.target.value))}
                      className="bg-[#FFFDF8] border border-[#E8DFD1] rounded-md px-2 py-1 font-semibold text-[#45372F]"
                    >
                      <option value={2}>2 people (half-half)</option>
                      <option value={3}>3 people</option>
                      <option value={4}>4 people</option>
                      <option value={5}>5 people</option>
                      <option value={6}>6 people</option>
                    </select>
                  </div>
                  <div className="font-bold text-[#A6533D]">
                    My share: {currency} {myCalculatedShare.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#786E65] uppercase tracking-wider">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Split roti canai with Danial; assignment cram session"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3.5 py-2 text-xs text-[#45372F] font-medium outline-none focus:ring-2 focus:ring-[#A6533D]/25 focus:border-[#A6533D]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#E8DFD1]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-[#786E65] hover:text-[#45372F] rounded-lg border border-[#E8DFD1] bg-transparent hover:bg-[#F5F0E6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={numAmount <= 0}
              className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-bold text-[#FFFDF8] transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-[#A6533D] hover:bg-[#8E4330] shadow-cozy-1'
                  : 'bg-[#7A8471] hover:bg-[#646E5C] shadow-cozy-1'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span>🐾</span>
              <span>
                {type === 'expense'
                  ? `Log Expense (${currency} ${numAmount > 0 ? numAmount.toFixed(2) : '0.00'})`
                  : `Record Inflow (${currency} ${numAmount > 0 ? numAmount.toFixed(2) : '0.00'})`}
              </span>
            </button>
          </div>
        </form>

        {/* Custom Category Modal Overlay */}
        {showAddCategoryModal && (
          <div className="absolute inset-0 bg-[#251912]/50 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 w-full max-w-sm space-y-4 shadow-cozy-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#45372F] flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#E9C66A]" /> Add Custom Category
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-[#786E65] hover:text-[#45372F]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCustomCategory} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#786E65] block mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gym Pass, Badminton, Art Supplies"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-xs font-semibold text-[#45372F] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#786E65] block mb-1">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={newCatEmoji}
                      onChange={(e) => setNewCatEmoji(e.target.value)}
                      className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#45372F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#786E65] block mb-1">
                      Monthly Cap ({currency})
                    </label>
                    <input
                      type="number"
                      value={newCatBudget}
                      onChange={(e) => setNewCatBudget(e.target.value)}
                      className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-xs font-semibold text-[#45372F] outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="flex-1 py-1.5 text-xs font-bold text-[#786E65] bg-[#F5F0E6] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 text-xs font-bold text-[#FFFDF8] bg-[#A6533D] hover:bg-[#8E4330] rounded-lg"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
