import React, { useState } from 'react';
import { Plus, Sparkles, Heart, Check, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { SavingsJar } from '../types';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CatPawWatermark } from './CatPawWatermark';
import { WhiskerProgressBar } from './WhiskerProgressBar';

interface SavingsJarsViewProps {
  jars: SavingsJar[];
  currency?: string;
  onUpdateJarAmount: (jarId: string, deltaAmount: number) => void;
  onCreateJar: (jar: Omit<SavingsJar, 'id'>) => void;
  onDeleteJar: (jarId: string) => void;
}

export const SavingsJarsView: React.FC<SavingsJarsViewProps> = ({
  jars,
  currency = 'RM',
  onUpdateJarAmount,
  onCreateJar,
  onDeleteJar,
}) => {
  const [selectedJarForDeposit, setSelectedJarForDeposit] = useState<SavingsJar | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('20');
  const [depositMode, setDepositMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [celebrationJarId, setCelebrationJarId] = useState<string | null>(null);

  // New jar form state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('200');
  const [newEmoji, setNewEmoji] = useState('🏖️');
  const [newNote, setNewNote] = useState('');

  const totalSavedAcrossJars = jars.reduce((s, j) => s + j.currentAmount, 0);
  const totalTargetAcrossJars = jars.reduce((s, j) => s + j.targetAmount, 0);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJarForDeposit) return;
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;

    const delta = depositMode === 'deposit' ? amt : -amt;
    onUpdateJarAmount(selectedJarForDeposit.id, delta);

    if (depositMode === 'deposit') {
      setCelebrationJarId(selectedJarForDeposit.id);
      setTimeout(() => setCelebrationJarId(null), 2200);
    }

    setSelectedJarForDeposit(null);
    setDepositAmount('20');
  };

  const handleCreateJarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateJar({
      title: newTitle.trim(),
      targetAmount: parseFloat(newTarget) || 100,
      currentAmount: 0,
      emoji: newEmoji || '🐾',
      color: '#E9C66A',
      note: newNote.trim(),
    });

    setNewTitle('');
    setNewNote('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#45372F] flex items-center gap-2">
            <span>🍯</span> Student Savings Jars
          </h2>
          <p className="text-xs text-[#786E65] mt-0.5">
            Turn your daily spared coins and tutoring earnings into semester dreams and peace of mind.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#45372F] bg-[#E9C66A] hover:bg-[#FDD97B] rounded-lg transition-colors cursor-pointer shadow-xs border border-[#DAC1BB]/40"
        >
          <Plus size={14} />
          <span>New Savings Jar</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="relative bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 sm:p-6 shadow-cozy-1 overflow-hidden">
        <CatPawWatermark className="absolute -bottom-4 -right-4" size={140} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#786E65]">
              Total Stashed in Jars
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <CurrencyDisplay
                amount={totalSavedAcrossJars}
                prefix={currency}
                size="display"
                colorScheme="matcha"
              />
              <span className="text-sm font-semibold text-[#786E65]">
                / {currency} {totalTargetAcrossJars.toFixed(2)} combined target
              </span>
            </div>
            <p className="text-xs text-[#786E65] mt-1">
              {totalSavedAcrossJars > 0
                ? "Every ringgit kept aside is one less worry during finals week! 🐾"
                : "No coins in your jars yet. Toss in spare canteen change anytime!"}
            </p>
          </div>

          <div className="w-full sm:w-64 pt-2 sm:pt-0">
            <div className="flex items-center justify-between text-xs font-semibold mb-1 text-[#45372F]">
              <span>Overall Progress</span>
              <span>
                {Math.round((totalSavedAcrossJars / (totalTargetAcrossJars || 1)) * 100)}%
              </span>
            </div>
            <WhiskerProgressBar
              progress={(totalSavedAcrossJars / (totalTargetAcrossJars || 1)) * 100}
              variant="ochre"
              milestones={[50, 80]}
            />
          </div>
        </div>
      </div>

      {/* Jars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jars.map((jar) => {
          const percent = Math.min(Math.round((jar.currentAmount / jar.targetAmount) * 100), 100);
          const isComplete = jar.currentAmount >= jar.targetAmount;
          const isCelebrating = celebrationJarId === jar.id;

          return (
            <div
              key={jar.id}
              className={`relative bg-[#FFFDF8] rounded-2xl border p-5 shadow-cozy-1 flex flex-col justify-between transition-all duration-300 hover:shadow-cozy-2 ${
                isCelebrating
                  ? 'border-[#E9C66A] ring-4 ring-[#E9C66A]/30 scale-[1.02]'
                  : 'border-[#E8DFD1] hover:border-[#DAC1BB]'
              }`}
            >
              {isCelebrating && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#E9C66A] text-[#45372F] text-[10px] font-extrabold animate-bounce">
                  + Coins Tossed! 🪙
                </div>
              )}

              <div>
                {/* Visual Glass Jar Representation */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Cozy Jar illustration */}
                    <div className="relative w-12 h-16 rounded-b-xl rounded-t-sm border-2 border-[#DAC1BB] bg-[#FAF6EE] flex items-end justify-center overflow-hidden shadow-inner">
                      {/* Cork Stopper on top */}
                      <div className="absolute top-0 w-8 h-2 bg-[#A6533D]/60 rounded-xs border-b border-[#883C28]" />
                      
                      {/* Liquid / Coin Level */}
                      <div
                        className="w-full transition-all duration-700 ease-out bg-gradient-to-t from-[#E9C66A] to-[#FDD97B]"
                        style={{ height: `${percent}%` }}
                      />

                      {/* Jar Emoji floating */}
                      <span className="absolute inset-0 flex items-center justify-center text-lg select-none pointer-events-none drop-shadow-xs">
                        {jar.emoji}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#45372F] leading-tight">
                        {jar.title}
                      </h4>
                      <span className="text-[11px] text-[#786E65] block mt-0.5">
                        Target: {currency} {jar.targetAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isComplete
                        ? 'bg-[#E6F0DA] text-[#4C5645]'
                        : 'bg-[#FFDF91]/70 text-[#755B03]'
                    }`}
                  >
                    {isComplete ? 'Goal Reached! 🏆' : `${percent}%`}
                  </span>
                </div>

                {jar.note && (
                  <p className="text-xs text-[#786E65] italic mb-3 line-clamp-2">
                    "{jar.note}"
                  </p>
                )}

                {/* Progress bar */}
                <WhiskerProgressBar
                  progress={percent}
                  variant={isComplete ? 'matcha' : 'ochre'}
                  milestones={[50, 80]}
                />

                <div className="flex items-center justify-between text-xs mt-1.5 font-semibold">
                  <CurrencyDisplay
                    amount={jar.currentAmount}
                    prefix={currency}
                    size="md"
                    colorScheme="espresso"
                  />
                  <span className="text-[11px] text-[#786E65]">
                    {isComplete
                      ? 'Ready for adventure!'
                      : `${currency} ${(jar.targetAmount - jar.currentAmount).toFixed(2)} to go`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#E8DFD1]/70 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedJarForDeposit(jar);
                    setDepositMode('deposit');
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-[#E9C66A] hover:bg-[#FDD97B] text-[#45372F] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ArrowUpRight size={13} />
                  <span>Toss Coins</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedJarForDeposit(jar);
                    setDepositMode('withdraw');
                  }}
                  disabled={jar.currentAmount <= 0}
                  className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#F5F0E6] hover:bg-[#DAC1BB]/40 text-[#786E65] hover:text-[#45372F] border border-[#E8DFD1] transition-colors cursor-pointer disabled:opacity-40"
                  title="Withdraw back to wallet"
                >
                  <ArrowDownLeft size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw Modal */}
      {selectedJarForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251912]/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 w-full max-w-sm shadow-cozy-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedJarForDeposit.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-[#45372F]">
                    {depositMode === 'deposit' ? 'Toss Coins in Jar' : 'Withdraw from Jar'}
                  </h4>
                  <span className="text-[11px] text-[#786E65]">
                    {selectedJarForDeposit.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJarForDeposit(null)}
                className="text-[#786E65] hover:text-[#45372F]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#786E65] block mb-1">
                  Amount ({currency})
                </label>
                <div className="flex items-center bg-[#F5F0E6] border border-[#E8DFD1] rounded-xl px-3 py-2">
                  <span className="font-bold text-[#786E65] mr-2">{currency}</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={depositMode === 'withdraw' ? selectedJarForDeposit.currentAmount : 2000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-[#45372F] outline-none"
                    autoFocus
                  />
                </div>
                {/* Preset chips */}
                <div className="flex gap-1.5 mt-2">
                  {[5, 10, 20, 50].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDepositAmount(v.toString())}
                      className="px-2 py-1 text-xs font-semibold rounded-md bg-[#FFFDF8] border border-[#E8DFD1] text-[#45372F] hover:bg-[#FBE4D8]"
                    >
                      +{currency} {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#E8DFD1]">
                <button
                  type="button"
                  onClick={() => setSelectedJarForDeposit(null)}
                  className="flex-1 py-2 text-xs font-bold text-[#786E65] hover:bg-[#F5F0E6] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 text-xs font-bold text-[#FFFDF8] rounded-lg shadow-cozy-1 ${
                    depositMode === 'deposit'
                      ? 'bg-[#A6533D] hover:bg-[#8E4330]'
                      : 'bg-[#786E65] hover:bg-[#45372F]'
                  }`}
                >
                  {depositMode === 'deposit' ? '🪙 Confirm Deposit' : 'Confirm Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Jar Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251912]/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DFD1] p-5 w-full max-w-sm shadow-cozy-3 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#45372F] flex items-center gap-2">
                <span>🍯</span> Start New Savings Jar
              </h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#786E65] hover:text-[#45372F]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateJarSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#786E65] block mb-1">
                  Jar Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coldplay Ticket, New Keyboard, Gym"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-xs font-semibold text-[#45372F] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#786E65] block mb-1">
                    Emoji Motif
                  </label>
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#45372F] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#786E65] block mb-1">
                    Target ({currency})
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-xs font-semibold text-[#45372F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#786E65] block mb-1">
                  Why are you saving for this?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reward after passing finals!"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-[#F5F0E6] border border-[#E8DFD1] rounded-lg px-3 py-2 text-xs font-semibold text-[#45372F] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#E8DFD1]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-1.5 text-xs font-bold text-[#786E65] hover:bg-[#F5F0E6] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-bold text-[#45372F] bg-[#E9C66A] hover:bg-[#FDD97B] rounded-lg shadow-2xs"
                >
                  Create Jar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
