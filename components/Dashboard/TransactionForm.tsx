"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Transaction } from "@/models/Transaction";
import { FaTimes, FaQuestionCircle } from "react-icons/fa";
import { categoryConfig, CategoryConfig } from "@/models/categoryConfig";

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

const typeConfig = {
  expense: {
    colors: "bg-red-400/20 text-red-300",
    label: "Expense",
  },
  income: {
    colors: "bg-green-400/20 text-green-300",
    label: "Income",
  },
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date(),
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState<CategoryConfig>(categoryConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type as "expense" | "income",
          date: formData.date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const newTransaction = await response.json();
      onAdd(newTransaction);

      setFormData({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date(),
      });

      router.refresh();
    } catch (error) {
      console.error("Error adding transaction:", error);
      // You might want to add error handling UI here
    }
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

        setFormData((prev) => ({ ...prev, category: customCategory }));
        setShowCustomCategory(false);
        setCustomCategory("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryName }),
      });

      if (!response.ok) throw new Error("Failed to delete category");

      const newCategories = { ...categories };
      delete newCategories[categoryName];
      setCategories(newCategories);

      if (formData.category === categoryName) {
        setFormData((prev) => ({ ...prev, category: "" }));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">
          Type
        </label>
        <div className="flex gap-2 sm:gap-3 mt-1">
          {Object.entries(typeConfig).map(([type, config]) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-1 justify-center backdrop-blur-md transition-all duration-300 border-2 ${
                formData.type === type
                  ? type === "expense"
                    ? "bg-red-400/10 border-red-400/50 text-red-300 shadow-[inset_0_0_20px_rgba(248,113,113,0.15)]"
                    : "bg-green-400/10 border-green-400/50 text-green-300 shadow-[inset_0_0_20px_rgba(74,222,128,0.15)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full h-20 sm:h-24 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-sm sm:text-base text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 resize-none transition-all duration-300"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">
          Amount (₹)
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/50 text-sm sm:text-base">
            ₹
          </span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="pl-7 block w-full h-10 sm:h-12 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-sm sm:text-base text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Object.entries(categories).map(([category, config]) => (
            <div key={category} className="relative group">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category }))}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all duration-300 border-2 ${
                  formData.category === category
                    ? `${config.colors} border-current shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]`
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {React.createElement(config.icon, {
                  className: "w-3 h-3 sm:w-4 sm:h-4",
                })}
                {category}
              </button>
              {category !== "Other" && (
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowCustomCategory(true)}
            className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 backdrop-blur-md transition-all duration-300 border-2 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
          >
            + Custom
          </button>
        </div>

        {showCustomCategory && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyPress={handleCustomCategoryKeyPress}
              placeholder="Enter custom category"
              className="flex-1 h-12 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 px-3 transition-all duration-300"
              autoFocus
            />
            <button
              type="button"
              onClick={handleCustomCategorySubmit}
              className="px-4 rounded-xl border-2 border-green-400/30 bg-white/5 text-green-300 hover:bg-white/10 hover:border-green-400/50"
              disabled={!customCategory.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomCategory(false);
                setCustomCategory("");
              }}
              className="px-4 rounded-xl border-2 border-red-400/30 bg-white/5 text-red-300 hover:bg-white/10 hover:border-red-400/50"
            >
              Cancel
            </button>
          </div>
        )}

        {formData.category && !categoryConfig[formData.category] && (
          <div className="mt-2">
            <span className="text-sm text-white/60">
              Selected category:{" "}
              <span className="text-white/90">{formData.category}</span>
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">
          Date
        </label>
        <DatePicker
          selected={formData.date}
          onChange={(date: Date | null) =>
            date && setFormData({ ...formData, date })
          }
          className="block w-full h-10 sm:h-12 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-sm sm:text-base text-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] focus:border-blue-400/50 focus:ring-blue-400/20 px-3 transition-all duration-300"
          dateFormat="MMMM d, yyyy"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full relative border-2 border-purple-400/30 bg-white/5 backdrop-blur-md text-white py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base
        hover:bg-white/10 hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
        focus:ring-offset-2 focus:ring-offset-slate-800 transform transition-all duration-300 
        hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 group overflow-hidden"
      >
        <span className="relative font-medium">Add Transaction</span>
      </button>
    </form>
  );
}
