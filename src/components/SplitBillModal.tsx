import React, { useState } from 'react';
import { X, Copy, Check, Users, Plus } from 'lucide-react';
import { Transaction } from '../types';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  currency = 'RM',
  onAddTransaction,
}) => {
  const [totalAmount, setTotalAmount] = useState('36.00');
  const [peopleCount, setPeopleCount] = useState(3);
  const [mealDescription, setMealDescription] = useState('Mamak Supper at Hakim');
  const [paymentMethod, setPaymentMethod] = useState('DuitNow / Touch n Go eWallet');
  const [copied, setCopied] = useState(false);
  const [addedToLedger, setAddedToLedger] = useState(false);

  if (!isOpen) return null;

  const total = parseFloat(totalAmount) || 0;
  const perPerson = peopleCount > 0 ? total / peopleCount : 0;

  const shareText = `Hey guys! 🐾 Bill for "${mealDescription}" came to ${currency} ${total.toFixed(2)}.
Each person's share is: ${currency} ${perPerson.toFixed(2)} (${peopleCount} pax).
Pay via: ${paymentMethod}
Thanks! 🙏`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogMyShare = () => {
    onAddTransaction({
      amount: total,
      type: 'expense',
      categoryId: 'mamak',
      merchant: mealDescription,
      date: new Date().toISOString().split('T')[0],
      time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      note: `Split between ${peopleCount} friends (${currency} ${perPerson.toFixed(2)} my share)`,
      splitWithRoommate: true,
      roommateCount: peopleCount,
      myShare: perPerson,
    });
    setAddedToLedger(true);
    setTimeout(() => {
      setAddedToLedger(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251912]/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 sm:p-6 w-full max-w-md shadow-cozy-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥢</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#45372F]">
                Mamak & Dorm Bill Splitter
              </h3>
              <p className="text-[11px] text-[#786E65]">
                Fair & friendly splits for late-night study feasts
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

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-[#786E65] block mb-1">
              Total Receipt Amount ({currency})
            </label>
            <div className="flex items-center bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2">
              <span className="font-bold text-[#786E65] mr-2">{currency}</span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-transparent text-xl font-bold text-[#45372F] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#786E65] block mb-1 flex items-center gap-1">
                <Users size={12} /> Split Between
              </label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2 text-xs font-bold text-[#45372F]"
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} friends
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#786E65] block mb-1">
                Meal / Occasion
              </label>
              <input
                type="text"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2 text-xs font-semibold text-[#45372F]"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-xl bg-[#FFEADF]/70 border border-[#DAC1BB] text-center space-y-1">
            <span className="text-xs font-semibold text-[#883C28] block">
              Each Friend Pays
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#45372F] tabular-numbers font-sans">
              <span className="text-sm font-semibold text-[#786E65] mr-1">{currency}</span>
              {perPerson.toFixed(2)}
            </div>
          </div>

          {/* Copyable Message Box */}
          <div className="relative bg-[#F5F0E6] rounded-xl border border-[#E8DFD1] p-3">
            <p className="text-xs text-[#45372F] whitespace-pre-line font-mono text-[11px] leading-relaxed">
              {shareText}
            </p>
            <button
              onClick={handleCopy}
              className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[#FFFDF8] hover:bg-[#FBE4D8] border border-[#E8DFD1] text-xs font-bold text-[#45372F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-[#7A8471]" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard! 🐾' : 'Copy Message for WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Action Button: Log my share into ledger */}
        <div className="pt-2 border-t border-[#E8DFD1] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold text-[#786E65] hover:bg-[#F5F0E6] rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleLogMyShare}
            disabled={addedToLedger || total <= 0}
            className="flex-1 py-2 text-xs font-bold text-[#FFFDF8] bg-[#A6533D] hover:bg-[#8E4330] rounded-lg flex items-center justify-center gap-1 shadow-cozy-1 transition-all cursor-pointer"
          >
            {addedToLedger ? (
              <>
                <Check size={14} />
                <span>Logged to Ledger!</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Log My Share ({currency} {perPerson.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
