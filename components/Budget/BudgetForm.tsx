import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { defaultCategories } from '@/models/categoryConfig';

interface BudgetFormProps {
  onSubmit: (budget: { category: string; amount: number }) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export default function BudgetForm({ onSubmit, onCancel, isOpen }: BudgetFormProps) {
  const [newBudget, setNewBudget] = useState({ category: '', amount: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newBudget);
    setNewBudget({ category: '', amount: 0 });
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-900/50 rounded-lg">
      <div className="grid gap-4">
        <select
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
          className="px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
          required
        >
          <option value="">Select Category</option>
          {defaultCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-400">₹</span>
          <input
            type="number"
            placeholder="Amount"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) })}
            className="pl-7 px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white w-full"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
} 