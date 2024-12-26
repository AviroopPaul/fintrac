import { Transaction } from "../../models/Transaction";
import { useState, useEffect } from "react";
import {
  categoryConfig,
  CategoryConfig,
  defaultCategories,
} from "@/models/categoryConfig";
import { FaTimes, FaQuestionCircle } from "react-icons/fa";

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
  onSave,
}: TransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"Other" | string>("Other");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState<CategoryConfig>(categoryConfig);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category || "Other");
      setType(transaction.type || "expense");

      if (
        transaction.category &&
        !Object.keys(categoryConfig).includes(transaction.category)
      ) {
        setShowCustomCategory(true);
      }
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
      type,
    });
    onClose();
  };

  const handleAddCustomCategory = async () => {
    if (customCategory.trim()) {
      const newCategory = {
        colors: "bg-gray-400/20 text-gray-300",
        icon: FaQuestionCircle,
        backgroundColor: "rgba(156, 163, 175, 0.6)",
      };

      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: customCategory,
            colors: newCategory.colors,
            backgroundColor: newCategory.backgroundColor,
          }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        setCategories((prev) => ({
          ...prev,
          [customCategory]: newCategory,
        }));

        setCategory(customCategory);
        setShowCustomCategory(false);
        setCustomCategory("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      handleAddCustomCategory();
    }
  };

  const handleCustomCategoryKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomCategorySubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {transaction ? "Edit Transaction" : "View Transaction"}
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
            <div className="space-y-2">
              {!showCustomCategory ? (
                <>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {defaultCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    {Object.keys(categories)
                      .filter((cat) => !defaultCategories.includes(cat as any))
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} (Custom)
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(true)}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 
                      dark:hover:text-blue-300 transition-colors"
                  >
                    or add a new category
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyPress={handleCustomCategoryKeyPress}
                    placeholder="Enter new category name"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCustomCategorySubmit}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg
                        hover:bg-blue-600 transition-colors"
                      disabled={!customCategory.trim()}
                    >
                      Add Category
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCustomCategory("");
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 
                        hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "expense" | "income")}
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
