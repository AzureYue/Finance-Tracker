import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signOutUser, testConnection } from './firebase';
import {
  INITIAL_PROFILE,
  INITIAL_CATEGORIES,
  INITIAL_BUDGET_CONFIG,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import { Transaction, Category, BudgetConfig, StudentProfile } from './types';
import { Header } from './components/Header';
import { NavigationRail, TabId } from './components/NavigationRail';
import { DailyLedgerView } from './components/DailyLedgerView';
import { BudgetWalletsView } from './components/BudgetWalletsView';
import { InsightsView } from './components/InsightsView';
import { QuickAddModal } from './components/QuickAddModal';
import { SplitBillModal } from './components/SplitBillModal';
import { ExportModal } from './components/ExportModal';
import { LoginPage } from './components/LoginPage';
import {
  seedInitialUserDataIfEmpty,
  subscribeToUserLedger,
  addTransactionFirestore,
  deleteTransactionFirestore,
  addCategoryFirestore,
  updateCategoryBudgetFirestore,
  updateBudgetConfigFirestore,
} from './services/firestoreSync';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // App data state synced via Firestore
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(INITIAL_BUDGET_CONFIG);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabId>('ledger');

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen to Firebase Auth state (No offline/guest mode)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Update profile with user's Google display name
        if (user.displayName) {
          setProfile((prev) => ({
            ...prev,
            name: user.displayName || prev.name,
          }));
        }

        // Test connection as required by skill
        testConnection();

        // Seed initial data if the user's collection is new
        await seedInitialUserDataIfEmpty(user.uid, {
          name: user.displayName || 'Student',
          email: user.email || undefined,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore when authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserLedger(currentUser.uid, {
      onTransactions: (txs) => setTransactions(txs),
      onCategories: (cats) => setCategories(cats),
      onBudget: (b) => setBudgetConfig(b),
    });

    return () => unsubscribe();
  }, [currentUser]);

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

  // Handlers - all persist directly to Firestore
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    if (!currentUser) return;
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };

    await addTransactionFirestore(currentUser.uid, created);
    showToast(newTx.type === 'expense' ? 'Expense logged 🐾' : 'Allowance recorded! 💵');
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!currentUser) return;
    await deleteTransactionFirestore(currentUser.uid, id);
    showToast('Transaction removed');
  };

  const handleAddCategory = async (newCat: Category) => {
    if (!currentUser) return;
    await addCategoryFirestore(currentUser.uid, newCat);
    showToast(`Added category: ${newCat.name}`);
  };

  const handleUpdateCategoryBudget = async (catId: string, newBudget: number) => {
    if (!currentUser) return;
    await updateCategoryBudgetFirestore(currentUser.uid, catId, newBudget);
  };

  const handleUpdateBudgetConfig = async (newConfig: BudgetConfig) => {
    if (!currentUser) return;
    await updateBudgetConfigFirestore(currentUser.uid, newConfig);
    showToast('Budget settings updated');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      showToast('Signed out of student account');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex flex-col items-center justify-center p-4">
        <div className="text-4xl animate-bounce mb-3">🐱☕</div>
        <p className="text-sm font-bold text-[#45372F]">Opening Kopi Duit...</p>
      </div>
    );
  }

  // Offline mode disabled: User must sign in
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col font-sans selection:bg-[#E9C66A]/30">
      {/* Sticky Header with Kopi Duit branding */}
      <Header
        profile={profile}
        currentUser={currentUser}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSplitTool={() => setIsSplitBillOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Container: Max 1120px centered with 1.5rem gutters on desktop */}
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
            <span>Kopi Duit</span>
            <span>•</span>
            <span>Personal finance ledger for university undergraduates</span>
            <span>🐾</span>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#88726D]">Press 'N' to log spend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
