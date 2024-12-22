'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
    colors: "bg-orange-400/20 text-orange-300",
    icon: FaUtensils,
  },
  'Transportation': {
    colors: "bg-blue-400/20 text-blue-300",
    icon: FaBus,
  },
  'Shopping': {
    colors: "bg-pink-400/20 text-pink-300",
    icon: FaShoppingBag,
  },
  'Bills & Utilities': {
    colors: "bg-red-400/20 text-red-300",
    icon: FaFileInvoiceDollar,
  },
  'Entertainment': {
    colors: "bg-purple-400/20 text-purple-300",
    icon: FaGamepad,
  },
  'Healthcare': {
    colors: "bg-emerald-400/20 text-emerald-300",
    icon: FaMedkit,
  },
  'Investments': {
    colors: "bg-green-400/20 text-green-300",
    icon: FaPiggyBank,
  },
  'Income': {
    colors: "bg-teal-400/20 text-teal-300",
    icon: FaMoneyBillWave,
  },
  'Education': {
    colors: "bg-yellow-400/20 text-yellow-300",
    icon: FaGraduationCap,
  },
  'Other': {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
  },
};

const typeConfig = {
  'expense': {
    colors: "bg-red-400/20 text-red-300",
    label: "Expense"
  },
  'income': {
    colors: "bg-green-400/20 text-green-300",
    label: "Income"
  }
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date()
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
          date: formData.date.toISOString()
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
        date: new Date()
      });

      router.refresh();
    } catch (error) {
      console.error('Error adding transaction:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Type</label>
        <div className="flex gap-3 mt-1">
          {Object.entries(typeConfig).map(([type, config]) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 flex-1 justify-center backdrop-blur-md transition-all duration-300 border-2 ${
                formData.type === type
                  ? type === 'expense' 
                    ? 'bg-red-400/10 border-red-400/50 text-red-300 shadow-[inset_0_0_20px_rgba(248,113,113,0.15)]'
                    : 'bg-green-400/10 border-green-400/50 text-green-300 shadow-[inset_0_0_20px_rgba(74,222,128,0.15)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full h-24 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 resize-none transition-all duration-300"
          required
        />
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-white/80 mb-2">Amount (₹)</label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/50">
            ₹
          </span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="pl-7 block w-full h-12 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300"
            required
          />
          <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, category })}
              className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 backdrop-blur-md transition-all duration-300 border-2 ${
                formData.category === category
                  ? `${config.colors} border-current shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]`
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {React.createElement(config.icon, {
                className: "w-4 h-4"
              })}
              {category}
            </button>
          ))}
        </div>
        <input type="hidden" value={formData.category} required />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
        <DatePicker
          selected={formData.date}
          onChange={(date: Date | null) => date && setFormData({ ...formData, date })}
          className="block w-full h-12 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 px-3 transition-all duration-300"
          dateFormat="MMMM d, yyyy"
          required
          showPopperArrow={false}
          calendarClassName="glass-calendar"
          wrapperClassName="w-full"
          popperClassName="glass-calendar-popper"
        />
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-br from-blue-500 to-violet-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-md relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-violet-400/0 group-hover:from-blue-400/10 group-hover:to-violet-400/10 transition-all duration-300" />
        <span className="relative">Add Transaction</span>
      </button>
    </form>
  );
}
