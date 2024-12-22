
export interface Transaction {
  _id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  user_id: string;
}

export const COLLECTION_NAME = 'transactions'; 