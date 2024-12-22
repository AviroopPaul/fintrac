import React from "react";
import { useState } from "react";
import TransactionModal from "./TransactionModal";
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
import type { Transaction } from "@/models/Transaction";

// Update the categoryConfig to match TransactionForm categories
const categoryConfig: {
  [key: string]: {
    colors: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  "Food & Dining": {
    colors: "bg-orange-400/20 text-orange-300",
    icon: FaUtensils,
  },
  Transportation: {
    colors: "bg-blue-400/20 text-blue-300",
    icon: FaBus,
  },
  Shopping: {
    colors: "bg-pink-400/20 text-pink-300",
    icon: FaShoppingBag,
  },
  "Bills & Utilities": {
    colors: "bg-red-400/20 text-red-300",
    icon: FaFileInvoiceDollar,
  },
  Entertainment: {
    colors: "bg-purple-400/20 text-purple-300",
    icon: FaGamepad,
  },
  Healthcare: {
    colors: "bg-emerald-400/20 text-emerald-300",
    icon: FaMedkit,
  },
  Investments: {
    colors: "bg-green-400/20 text-green-300",
    icon: FaPiggyBank,
  },
  Income: {
    colors: "bg-teal-400/20 text-teal-300",
    icon: FaMoneyBillWave,
  },
  Education: {
    colors: "bg-yellow-400/20 text-yellow-300",
    icon: FaGraduationCap,
  },
  Other: {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
  },
};

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (updatedTransaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
  onUpdate,
}: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const getCategoryConfig = (category: string) => {
    return (
      categoryConfig[category] || {
        colors: "bg-gray-100 text-gray-600",
        icon: FaQuestionCircle,
      }
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (categoryFilter === "All") return true;
    return transaction.category === categoryFilter;
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter("All")}
          className={`px-4 py-2 rounded-xl text-sm backdrop-blur-md transition-all duration-300 border-2 ${
            categoryFilter === "All"
              ? "bg-blue-400/10 border-blue-400/50 text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          All
        </button>
        {Object.entries(categoryConfig).map(([category, config]) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 backdrop-blur-md transition-all duration-300 border-2 ${
              categoryFilter === category
                ? `${config.colors} border-current shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]`
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            {React.createElement(config.icon, {
              className: "w-4 h-4",
            })}
            {category}
          </button>
        ))}
      </div>

      <div className="relative rounded-xl overflow-hidden backdrop-blur-md border-2 border-white/10 bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="max-h-[515px] overflow-y-auto relative">
          <ul className="divide-y divide-white/10">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction._id}
                className="flex justify-between py-4 px-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      getCategoryConfig(transaction.category).colors
                    }`}
                  >
                    {React.createElement(
                      getCategoryConfig(transaction.category).icon,
                      {
                        className: "w-4 h-4",
                      }
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/90">
                      {transaction.description}
                    </span>
                    <span className="text-sm text-white/50">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`${
                      transaction.type === "expense"
                        ? "text-red-300"
                        : "text-green-300"
                    } font-medium`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}₹
                    {transaction.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-300/80 hover:text-blue-300 transition-colors"
                    aria-label="Edit transaction"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => transaction._id && onDelete(transaction._id)}
                    className="text-red-300/80 hover:text-red-300 transition-colors"
                    aria-label="Delete transaction"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSave={onUpdate}
      />
    </>
  );
}
