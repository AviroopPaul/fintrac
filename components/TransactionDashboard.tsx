"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SummaryCards from "./SummaryCards";
import ChartSection from "./ChartSection";
import TransactionSection from "./TransactionSection";
import { Transaction } from "@/types/transaction";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TransactionDashboardProps {
  initialTransactions: Transaction[];
}

export default function TransactionDashboard({
  initialTransactions,
}: TransactionDashboardProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return transactionMonth === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  // Update summary calculation to use filtered transactions
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, savings };
  }, [filteredTransactions]);

  // Update categoryData to use filtered transactions
  const categoryData = useMemo(() => {
    const categoryTotals = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };
  }, [filteredTransactions]);

  // Format the month for display
  const formattedMonth = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [selectedMonth]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      // Update the local state by filtering out the deleted transaction
      setTransactions(
        transactions.filter((transaction) => transaction._id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleUpdate = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${updatedTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: updatedTransaction.description,
            amount: updatedTransaction.amount,
            category: updatedTransaction.category,
            date: updatedTransaction.date,
            type: updatedTransaction.type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      // Update the local state
      setTransactions(
        transactions.map((transaction) =>
          transaction._id === updatedTransaction._id
            ? updatedTransaction
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Financial Dashboard - {formattedMonth}
        </h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 w-full sm:w-auto"
        />
      </div>
      <SummaryCards {...summary} />
      <ChartSection categoryData={categoryData} />
      <TransactionSection
        transactions={filteredTransactions}
        onAddTransaction={addTransaction}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
