export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type TransactionFormData = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;

export const TRANSACTION_CATEGORIES = [
  'Food & Drinks',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Income',
  'Investment',
  'Other',
] as const;

export const EMOTION_TAGS = [
  { value: 'stress', label: 'Stress 😫' },
  { value: 'happy', label: 'Happy 😊' },
  { value: 'fomo', label: 'FOMO 👀' },
  { value: 'self-reward', label: 'Self-Reward 🎁' },
  { value: 'impulse', label: 'Impulse Buy 🛍' },
  { value: 'essential', label: 'Essential ✅' },
  { value: 'social', label: 'Social 👥' },
  { value: 'tired', label: 'Tired 😴' },
  { value: 'motivated', label: 'Motivated 💪' },
  { value: 'bored', label: 'Bored 😑' },
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];
export type EmotionTag = typeof EMOTION_TAGS[number]['value'];
