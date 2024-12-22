'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/models/Transaction';
import {
  FaUtensils,
  FaBus,
  FaGamepad,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaPiggyBank,
  FaMoneyBillWave,
  FaMedkit,
  FaGraduationCap,
  FaQuestionCircle,
} from "react-icons/fa";

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

const categoryConfig: {
  [key: string]: {
    colors: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  'Food & Dining': {
    colors: "bg-orange-100 text-orange-700",
    icon: FaUtensils,
  },
  'Transportation': {
    colors: "bg-blue-100 text-blue-700",
    icon: FaBus,
  },
  'Shopping': {
    colors: "bg-pink-100 text-pink-700",
    icon: FaShoppingBag,
  },
  'Bills & Utilities': {
    colors: "bg-red-100 text-red-700",
    icon: FaFileInvoiceDollar,
  },
  'Entertainment': {
    colors: "bg-purple-100 text-purple-700",
    icon: FaGamepad,
  },
  'Healthcare': {
    colors: "bg-green-100 text-green-700",
    icon: FaMedkit,
  },
  'Investments': {
    colors: "bg-green-100 text-green-700",
    icon: FaPiggyBank,
  },
  'Income': {
    colors: "bg-green-100 text-green-700",
    icon: FaMoneyBillWave,
  },
  'Education': {
    colors: "bg-yellow-100 text-yellow-700",
    icon: FaGraduationCap,
  },
  'Other': {
    colors: "bg-gray-100 text-gray-700",
    icon: FaQuestionCircle,
  },
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type as 'expense' | 'income',
          date: formData.date
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const newTransaction = await response.json();
      onAdd(newTransaction);
      
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });

      router.refresh();
    } catch (error) {
      console.error('Error adding transaction:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full h-10 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full h-24 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium  text-gray-300">Amount (₹)</label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            ₹
          </span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="pl-7 block w-full h-10 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, category })}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                formData.category === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {React.createElement(config.icon, {
                className: "w-3 h-3"
              })}
              {category}
            </button>
          ))}
        </div>
        <input
          type="hidden"
          value={formData.category}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full h-10 rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
      >
        Add Transaction
      </button>
    </form>
  );
}
