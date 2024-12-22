import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

// Helper function for Indian number formatting
const formatIndianNumber = (num: number): string => {
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return `₹${formatted}`;
};

export default function SummaryCards({ totalIncome, totalExpenses, savings }: SummaryProps) {
  const [showIncome, setShowIncome] = useState(false);
  const [showSavings, setShowSavings] = useState(false);

  const maskNumber = (amount: number) => '₹××,×××';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md 
        bg-gradient-to-br from-white/10 to-white/5 
        border-2 border-emerald-400
        shadow-[inset_0_0_20px_rgba(34,197,94,0.15)]
        p-6 hover:border-emerald-300 hover:shadow-emerald-500/20 transition-all duration-300 group">
        <div className="absolute inset-0 bg-green-900/5 backdrop-blur-xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-emerald-300">Total Income</h2>
            <button 
              onClick={() => setShowIncome(!showIncome)}
              className="text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              {showIncome ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-3xl font-bold text-white/90 mt-2 group-hover:scale-105 transition-transform">
            {showIncome ? formatIndianNumber(totalIncome) : maskNumber(totalIncome)}
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-xl backdrop-blur-md 
        bg-gradient-to-br from-white/10 to-white/5 
        border-2 border-rose-400
        shadow-[inset_0_0_20px_rgba(239,68,68,0.15)]
        p-6 hover:border-rose-300 hover:shadow-rose-500/20 transition-all duration-300 group">
        <div className="absolute inset-0 bg-red-900/5 backdrop-blur-xl" />
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-rose-300">Total Expenses</h2>
          <p className="text-3xl font-bold text-white/90 mt-2 group-hover:scale-105 transition-transform">
            {formatIndianNumber(totalExpenses)}
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-rose-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-xl backdrop-blur-md 
        bg-gradient-to-br from-white/10 to-white/5 
        border-2 border-blue-400
        shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]
        p-6 hover:border-blue-300 hover:shadow-blue-500/20 transition-all duration-300 group">
        <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-300">Savings</h2>
            <button 
              onClick={() => setShowSavings(!showSavings)}
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              {showSavings ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-3xl font-bold text-white/90 mt-2 group-hover:scale-105 transition-transform">
            {showSavings ? formatIndianNumber(savings) : maskNumber(savings)}
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
} 