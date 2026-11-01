import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import {
  INITIAL_PROFILE,
  INITIAL_CATEGORIES,
  INITIAL_SAVINGS_JARS,
  INITIAL_BUDGET_CONFIG,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import { Transaction, Category, SavingsJar, BudgetConfig, StudentProfile } from './types';
import { Header } from './components/Header';
import { NavigationRail, TabId } from './components/NavigationRail';
import { DailyLedgerView } from './components/DailyLedgerView';
import { BudgetWalletsView } from './components/BudgetWalletsView';
import { SavingsJarsView } from './components/SavingsJarsView';
import { InsightsView } from './components/InsightsView';
import { QuickAddModal } from './components/QuickAddModal';
import { SplitBillModal } from './components/SplitBillModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Persistence via localStorage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('cozy_ledger_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('cozy_ledger_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cozy_ledger_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [savingsJars, setSavingsJars] = useState<SavingsJar[]>(() => {
    const saved = localStorage.getItem('cozy_ledger_jars');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_JARS;
  });

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('cozy_ledger_budget');
    return saved ? JSON.parse(saved) : INITIAL_BUDGET_CONFIG;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabId>('ledger');

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cozy_ledger_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cozy_ledger_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cozy_ledger_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cozy_ledger_jars', JSON.stringify(savingsJars));
  }, [savingsJars]);

  useEffect(() => {
    localStorage.setItem('cozy_ledger_budget', JSON.stringify(budgetConfig));
  }, [budgetConfig]);

  // Keyboard shortcut: Press 'N' to open quick add
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [created, ...prev]);
    showToast(newTx.type === 'expense' ? 'Expense logged successfully 🐾' : 'Allowance recorded! 💵');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed');
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
    showToast(`Added category: ${newCat.name}`);
  };

  const handleUpdateCategoryBudget = (catId: string, newBudget: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, budgetMonthly: newBudget } : c))
    );
  };

  const handleUpdateBudgetConfig = (newConfig: BudgetConfig) => {
    setBudgetConfig(newConfig);
    showToast('Budget settings updated');
  };

  const handleUpdateJarAmount = (jarId: string, delta: number) => {
    setSavingsJars((prev) =>
      prev.map((j) => {
        if (j.id === jarId) {
          const nextVal = Math.max(0, j.currentAmount + delta);
          return { ...j, currentAmount: nextVal };
        }
        return j;
      })
    );
    showToast(delta > 0 ? 'Tossed coins into jar! 🪙' : 'Withdrawn from jar');
  };

  const handleCreateJar = (newJar: Omit<SavingsJar, 'id'>) => {
    const jar: SavingsJar = {
      ...newJar,
      id: `jar-${Date.now()}`,
    };
    setSavingsJars((prev) => [...prev, jar]);
    showToast('New savings jar created! 🍯');
  };

  const handleDeleteJar = (jarId: string) => {
    setSavingsJars((prev) => prev.filter((j) => j.id !== jarId));
    showToast('Jar removed');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transactions and settings to fresh sample student ledger?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setCategories(INITIAL_CATEGORIES);
      setSavingsJars(INITIAL_SAVINGS_JARS);
      setBudgetConfig(INITIAL_BUDGET_CONFIG);
      setProfile(INITIAL_PROFILE);
      localStorage.clear();
      showToast('Reset to original sample data 🐾');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col font-sans selection:bg-[#E9C66A]/30">
      {/* Sticky Header */}
      <Header
        profile={profile}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSplitTool={() => setIsSplitBillOpen(true)}
      />

      {/* Main Container: Max 1120px centered with 1.5rem gutters on desktop as per spec */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12">
        <div className="flex gap-6 items-start">
          {/* Docked Left Rail on Desktop / Tablet */}
          <NavigationRail
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />

          {/* Tab Content Panel */}
          <section className="flex-1 min-w-0">
            {activeTab === 'ledger' && (
              <DailyLedgerView
                transactions={transactions}
                categories={categories}
                budgetConfig={budgetConfig}
                currency={profile.currency}
                onDeleteTransaction={handleDeleteTransaction}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetWalletsView
                budgetConfig={budgetConfig}
                categories={categories}
                transactions={transactions}
                currency={profile.currency}
                onUpdateBudgetConfig={handleUpdateBudgetConfig}
                onUpdateCategoryBudget={handleUpdateCategoryBudget}
              />
            )}

            {activeTab === 'jars' && (
              <SavingsJarsView
                jars={savingsJars}
                currency={profile.currency}
                onUpdateJarAmount={handleUpdateJarAmount}
                onCreateJar={handleCreateJar}
                onDeleteJar={handleDeleteJar}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsView
                transactions={transactions}
                categories={categories}
                budgetConfig={budgetConfig}
                currency={profile.currency}
              />
            )}
          </section>
        </div>
      </main>

      {/* Floating Action Button for Mobile screens */}
      <div className="md:hidden fixed bottom-18 right-4 z-40">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-13 h-13 rounded-full bg-[#A6533D] text-[#FFFDF8] flex items-center justify-center shadow-cozy-3 hover:bg-[#8E4330] transition-all transform active:scale-90 cursor-pointer"
          aria-label="Add transaction"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        categories={categories}
        onAddTransaction={handleAddTransaction}
        onAddCategory={handleAddCategory}
        currency={profile.currency}
      />

      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        currency={profile.currency}
        onAddTransaction={handleAddTransaction}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        transactions={transactions}
        categories={categories}
        budgetConfig={budgetConfig}
        profile={profile}
        currency={profile.currency}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#45372F] text-[#FFFDF8] px-4 py-2.5 rounded-xl shadow-cozy-3 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>🐾</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subtle Warm Footer */}
      <footer className="border-t border-[#E8DFD1]/60 py-5 bg-[#FAF6EE]/50 text-center text-xs text-[#786E65]">
        <div className="max-w-[1120px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium">
            <span>Warm Whimsical Student Ledger</span>
            <span>•</span>
            <span>Designed for tertiary undergraduates</span>
            <span>🐾</span>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#88726D]">Press 'N' to log spend</span>
            <button
              onClick={handleResetData}
              className="hover:text-[#A6533D] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} /> Reset Sample Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
