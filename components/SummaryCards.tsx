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
      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-emerald-900/40 to-emerald-950/40
        border border-emerald-500/30
        p-6 hover:from-emerald-900/50 hover:to-emerald-950/50 
        hover:border-emerald-500/50 transition-all duration-300 group">
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
      </div>

      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-rose-900/40 to-rose-950/40
        border border-rose-500/30
        p-6 hover:from-rose-900/50 hover:to-rose-950/50 
        hover:border-rose-500/50 transition-all duration-300 group">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-rose-300">Total Expenses</h2>
          <p className="text-3xl font-bold text-white/90 mt-2 group-hover:scale-105 transition-transform">
            {formatIndianNumber(totalExpenses)}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-blue-900/40 to-blue-950/40
        border border-blue-500/30
        p-6 hover:from-blue-900/50 hover:to-blue-950/50 
        hover:border-blue-500/50 transition-all duration-300 group">
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
      </div>
    </div>
  );
} 