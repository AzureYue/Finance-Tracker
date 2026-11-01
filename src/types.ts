export type TransactionType = 'expense' | 'inflow';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  merchant: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note?: string;
  splitWithRoommate?: boolean;
  roommateCount?: number;
  myShare?: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  emoji: string;
  color: string; // Hex for accent
  bgTint: string; // Hex or rgba for 12% opacity badge
  type: TransactionType | 'both';
  budgetMonthly?: number;
  isCustom?: boolean;
}

export interface SavingsJar {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  targetDate?: string;
  color: string;
  note?: string;
}

export interface BudgetConfig {
  monthlyAllowance: number;
  fixedCosts: number;
  dailySafeTarget: number;
  semesterEndDate: string;
}

export interface StudentProfile {
  name: string;
  campus: string;
  streakDays: number;
  currency: string;
}
