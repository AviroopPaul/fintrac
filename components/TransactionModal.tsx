import { Transaction } from '../models/Transaction';
import { useState, useEffect } from 'react';

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

export default function TransactionModal({ 
  transaction, 
  isOpen, 
  onClose, 
  onSave 
}: TransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Investments',
    'Income',
    'Education',
    'Other'
  ];

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category || '');
      setType(transaction.type || 'expense');
    }
  }, [transaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    
    onSave({
      ...transaction,
      description,
      amount: parseFloat(amount),
      category,
      type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {transaction ? 'Edit Transaction' : 'View Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'expense' | 'income')}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 
                dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 