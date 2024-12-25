import React, { useState } from "react";
import TransactionModal from "./TransactionModal";
import type { Transaction } from "@/models/Transaction";
import { CategoryConfig, categoryConfig } from "@/models/categoryConfig";
import ExportButton from "./TransactionList/ExportButton";
import CategoryFilter from "./TransactionList/CategoryFilter";
import TransactionItem from "./TransactionList/TransactionItem";

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [categories] = useState<CategoryConfig>(categoryConfig);

  const filteredTransactions = transactions.filter((transaction) => {
    if (categoryFilter === "All") return true;
    return transaction.category === categoryFilter;
  });

  // Get unique categories from transactions
  const uniqueCategories = Array.from(
    new Set(transactions.map((t) => t.category))
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white/90 text-base sm:text-xl font-semibold">
          Recent Transactions
        </h2>
        <ExportButton transactions={transactions} />
      </div>

      <div className="mb-4 sm:mb-6">
        <CategoryFilter
          categories={uniqueCategories}
          selectedCategory={categoryFilter}
          onCategorySelect={setCategoryFilter}
        />
      </div>

      <div className="relative rounded-xl overflow-hidden backdrop-blur-md border-2 border-white/10 bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="max-h-[515px] overflow-y-auto relative">
          <ul className="divide-y divide-white/10">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onEdit={(t) => {
                  setSelectedTransaction(t);
                  setIsModalOpen(true);
                }}
                onDelete={onDelete}
              />
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
