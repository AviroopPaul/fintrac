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
    colors: "bg-orange-100 text-orange-700",
    icon: FaUtensils,
  },
  Transportation: {
    colors: "bg-blue-100 text-blue-700",
    icon: FaBus,
  },
  Shopping: {
    colors: "bg-pink-100 text-pink-700",
    icon: FaShoppingBag,
  },
  "Bills & Utilities": {
    colors: "bg-red-100 text-red-700",
    icon: FaFileInvoiceDollar,
  },
  Entertainment: {
    colors: "bg-purple-100 text-purple-700",
    icon: FaGamepad,
  },
  Healthcare: {
    colors: "bg-green-100 text-green-700",
    icon: FaMedkit,
  },
  Investments: {
    colors: "bg-green-100 text-green-700",
    icon: FaPiggyBank,
  },
  Income: {
    colors: "bg-green-100 text-green-700",
    icon: FaMoneyBillWave,
  },
  Education: {
    colors: "bg-yellow-100 text-yellow-700",
    icon: FaGraduationCap,
  },
  Other: {
    colors: "bg-gray-100 text-gray-700",
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
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter("All")}
          className={`px-3 py-1 rounded-full text-sm ${
            categoryFilter === "All"
              ? "bg-blue-500 text-white"
              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
          }`}
        >
          All
        </button>
        {Object.entries(categoryConfig).map(([category, config]) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
              categoryFilter === category
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {React.createElement(config.icon, {
              className: "w-3 h-3",
            })}
            {category}
          </button>
        ))}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <ul className="divide-y">
          {filteredTransactions.map((transaction) => (
            <li key={transaction._id} className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                {React.createElement(
                  getCategoryConfig(transaction.category).icon,
                  {
                    className: `w-4 h-4 ${
                      getCategoryConfig(transaction.category).colors.split(
                        " "
                      )[1]
                    }`,
                  }
                )}
                <span>{transaction.description}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`${
                    transaction.type === "expense"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {transaction.type === "expense" ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
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
                  className="text-red-500 hover:text-red-700"
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
