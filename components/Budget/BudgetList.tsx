import { Budget } from '@/models/Budget';
import { Transaction } from '@/models/Transaction';
import { categoryConfig } from '@/models/categoryConfig';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetList({ budgets, transactions }: BudgetListProps) {
  // Helper function to format currency in INR
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate spent amount for each category from transactions
  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const categoryData = categoryConfig[budget.category];
        const spentAmount = getSpentAmount(budget.category);
        const spentPercentage = (spentAmount / budget.amount) * 100;
        
        // Determine status color and label
        const getStatusInfo = () => {
          if (spentPercentage > 100) {
            return { color: 'bg-red-600', textColor: 'text-red-400', label: 'Exceeded' };
          } else if (spentPercentage > 80) {
            return { color: 'bg-yellow-600', textColor: 'text-yellow-400', label: 'Warning' };
          } else {
            return { 
              color: categoryData?.colors.split(' ')[0] || 'bg-blue-600', 
              textColor: 'text-green-400', 
              label: 'On Track' 
            };
          }
        };

        const statusInfo = getStatusInfo();
        
        return (
          <div
            key={budget._id}
            className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {categoryData && <categoryData.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${categoryData.colors}`} />}
                <h3 className="text-base sm:text-lg font-medium text-white">{budget.category}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${statusInfo.textColor} bg-opacity-10 ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className="text-blue-400 text-sm sm:text-base">{formatINR(budget.amount)}</span>
              </div>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-4 shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${statusInfo.color} shadow-lg shadow-${statusInfo.color}/30`}
                style={{
                  width: `${Math.min(spentPercentage, 100)}%`,
                  animation: 'growWidth 1.5s ease-out',
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
              <span className="text-gray-400">
                Spent: {formatINR(spentAmount)} ({spentPercentage.toFixed(0)}%)
              </span>
              <span className={`${spentAmount > budget.amount ? 'text-red-400' : 'text-gray-400'}`}>
                Remaining: {formatINR(budget.amount - spentAmount)}
              </span>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes growWidth {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
} 