import { useState, useEffect } from "react";
import { Budget } from "@/models/Budget";
import { categoryConfig } from "@/models/categoryConfig";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Partial<Budget>) => Promise<void>;
  budget?: Budget;
  month: string;
}

export default function BudgetModal({ isOpen, onClose, onSubmit, budget, month }: BudgetModalProps) {
  const [formData, setFormData] = useState<Partial<Budget>>({
    category: "",
    amount: 0,
    month: month,
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
      });
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {budget ? "Edit Budget" : "Create Budget"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-700 rounded-md p-2"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categoryConfig).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full bg-gray-700 rounded-md p-2"
              required
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
            >
              {budget ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 