interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

export default function SummaryCards({ totalIncome, totalExpenses, savings }: SummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-300">Total Income</h2>
        <p className="text-2xl font-bold text-white">₹{totalIncome}</p>
      </div>
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-300">Total Expenses</h2>
        <p className="text-2xl font-bold text-white">₹{totalExpenses}</p>
      </div>
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-300">Savings</h2>
        <p className="text-2xl font-bold text-white">₹{savings}</p>
      </div>
    </div>
  );
} 