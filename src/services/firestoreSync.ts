import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Transaction, Category, SavingsJar, BudgetConfig, StudentProfile } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_BUDGET_CONFIG,
  INITIAL_SAVINGS_JARS,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';

// Seed initial student sample data when a new student signs in for the first time
export async function seedInitialUserDataIfEmpty(
  uid: string,
  userProfile: { name: string; email?: string }
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const transactionsCol = collection(db, 'users', uid, 'transactions');

  try {
    const existingTxSnap = await getDocs(transactionsCol);
    if (!existingTxSnap.empty) {
      return; // Already initialized
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}/transactions`);
  }

  // Create user profile
  try {
    await setDoc(userDocRef, {
      uid,
      displayName: userProfile.name || 'Student',
      email: userProfile.email || '',
      campus: 'Sunway / Monash Campus',
      streakDays: 7,
      currency: 'RM',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }

  // Seed categories
  for (const cat of INITIAL_CATEGORIES) {
    try {
      await setDoc(doc(db, 'users', uid, 'categories', cat.id), {
        ...cat,
        userId: uid,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}/categories/${cat.id}`);
    }
  }

  // Seed budget config
  try {
    await setDoc(doc(db, 'users', uid, 'config', 'budget'), {
      ...INITIAL_BUDGET_CONFIG,
      userId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/config/budget`);
  }

  // Seed savings jars
  for (const jar of INITIAL_SAVINGS_JARS) {
    try {
      await setDoc(doc(db, 'users', uid, 'savingsJars', jar.id), {
        ...jar,
        userId: uid,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}/savingsJars/${jar.id}`);
    }
  }

  // Seed sample transactions
  for (const tx of INITIAL_TRANSACTIONS) {
    try {
      await setDoc(doc(db, 'users', uid, 'transactions', tx.id), {
        ...tx,
        userId: uid,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}/transactions/${tx.id}`);
    }
  }
}

// Subscriptions
export function subscribeToUserLedger(
  uid: string,
  callbacks: {
    onTransactions: (txs: Transaction[]) => void;
    onCategories: (cats: Category[]) => void;
    onJars: (jars: SavingsJar[]) => void;
    onBudget: (b: BudgetConfig) => void;
  }
): () => void {
  const unsubs: Unsubscribe[] = [];

  // Transactions listener
  const txPath = `users/${uid}/transactions`;
  const unsubTx = onSnapshot(
    collection(db, 'users', uid, 'transactions'),
    (snap) => {
      const list: Transaction[] = snap.docs.map((d) => d.data() as Transaction);
      // Sort newest first
      list.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      callbacks.onTransactions(list);
    },
    (err) => handleFirestoreError(err, OperationType.GET, txPath)
  );
  unsubs.push(unsubTx);

  // Categories listener
  const catPath = `users/${uid}/categories`;
  const unsubCat = onSnapshot(
    collection(db, 'users', uid, 'categories'),
    (snap) => {
      if (!snap.empty) {
        callbacks.onCategories(snap.docs.map((d) => d.data() as Category));
      }
    },
    (err) => handleFirestoreError(err, OperationType.GET, catPath)
  );
  unsubs.push(unsubCat);

  // Savings Jars listener
  const jarPath = `users/${uid}/savingsJars`;
  const unsubJars = onSnapshot(
    collection(db, 'users', uid, 'savingsJars'),
    (snap) => {
      callbacks.onJars(snap.docs.map((d) => d.data() as SavingsJar));
    },
    (err) => handleFirestoreError(err, OperationType.GET, jarPath)
  );
  unsubs.push(unsubJars);

  // Budget Config listener
  const configPath = `users/${uid}/config/budget`;
  const unsubConfig = onSnapshot(
    doc(db, 'users', uid, 'config', 'budget'),
    (snap) => {
      if (snap.exists()) {
        callbacks.onBudget(snap.data() as BudgetConfig);
      }
    },
    (err) => handleFirestoreError(err, OperationType.GET, configPath)
  );
  unsubs.push(unsubConfig);

  return () => {
    unsubs.forEach((u) => u());
  };
}

// Write mutations
export async function addTransactionFirestore(uid: string, tx: Transaction): Promise<void> {
  const path = `users/${uid}/transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'transactions', tx.id), {
      ...tx,
      userId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTransactionFirestore(uid: string, txId: string): Promise<void> {
  const path = `users/${uid}/transactions/${txId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'transactions', txId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function addCategoryFirestore(uid: string, cat: Category): Promise<void> {
  const path = `users/${uid}/categories/${cat.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'categories', cat.id), {
      ...cat,
      userId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateCategoryBudgetFirestore(
  uid: string,
  catId: string,
  newBudget: number
): Promise<void> {
  const path = `users/${uid}/categories/${catId}`;
  try {
    await setDoc(
      doc(db, 'users', uid, 'categories', catId),
      { budgetMonthly: newBudget },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateJarAmountFirestore(
  uid: string,
  jarId: string,
  delta: number,
  currentAmount: number
): Promise<void> {
  const path = `users/${uid}/savingsJars/${jarId}`;
  const nextVal = Math.max(0, currentAmount + delta);
  try {
    await setDoc(
      doc(db, 'users', uid, 'savingsJars', jarId),
      { currentAmount: nextVal },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createJarFirestore(uid: string, jar: SavingsJar): Promise<void> {
  const path = `users/${uid}/savingsJars/${jar.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'savingsJars', jar.id), {
      ...jar,
      userId: uid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteJarFirestore(uid: string, jarId: string): Promise<void> {
  const path = `users/${uid}/savingsJars/${jarId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'savingsJars', jarId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateBudgetConfigFirestore(
  uid: string,
  config: BudgetConfig
): Promise<void> {
  const path = `users/${uid}/config/budget`;
  try {
    await setDoc(
      doc(db, 'users', uid, 'config', 'budget'),
      { ...config, userId: uid },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
