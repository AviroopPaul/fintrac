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
import { Transaction } from "@/models/Transaction";
import { StarIcon } from "@heroicons/react/24/outline";
import CurrencyConverter from "./CurrencyConverter";
import { useSession } from "next-auth/react";
import WelcomeGuide from './WelcomeGuide';

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

interface AnalysisResult {
  patterns: string[];
  savingsSuggestions: string[];
  unusualActivity: string[];
  advice: string[];
}

export default function TransactionDashboard({
  initialTransactions,
}: TransactionDashboardProps) {
  const { data: session } = useSession();
  console.log(
    "TransactionDashboard received initialTransactions:",
    initialTransactions
  );
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Ensure we parse the date string from MongoDB correctly
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
        credentials: "include",
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
          credentials: "include",
          body: JSON.stringify({
            description: updatedTransaction.description,
            amount: updatedTransaction.amount,
            category: updatedTransaction.category,
            date: updatedTransaction.date, // This will be in ISO string format
            type: updatedTransaction.type,
            // Don't send user_id as it should be handled by the API
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

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ transactions: filteredTransactions }),
      });

      if (!response.ok) {
        throw new Error("Failed to get analysis");
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Error getting analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {session?.user?.name ? `${session.user.name}'s` : ""} Dashboard -{" "}
          {formattedMonth}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-68 max-md:w-80 max-lg:w-48 max-md:h-10 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-400/50 transition-all duration-300 text-blue-300 disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-sm sm:text-base"
          >
            <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {isAnalyzing ? (
              <span className="flex items-center gap-1 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Analyzing
              </span>
            ) : (
              "Analyse with AI"
            )}
          </button>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
          />
        </div>
      </div>
      {analysis && (
        <div className="mb-8 p-6 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-[0_0_25px_rgba(15,23,42,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <StarIcon className="h-6 w-6 text-blue-400" />
            AI Analysis Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Spending Patterns
              </h3>
              <ul className="space-y-2 text-slate-300">
                {analysis.patterns.map((pattern, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400/70">•</span>
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                Savings Suggestions
              </h3>
              <ul className="space-y-2 text-slate-300">
                {analysis.savingsSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400/70">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                Unusual Activity
              </h3>
              <ul className="space-y-2 text-slate-300">
                {analysis.unusualActivity.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400/70">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                Financial Advice
              </h3>
              <ul className="space-y-2 text-slate-300">
                {analysis.advice.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-400/70">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <SummaryCards {...summary} />
      <div className="mb-8">
        <CurrencyConverter />
      </div>
      <ChartSection categoryData={categoryData} />
      <TransactionSection
        transactions={filteredTransactions}
        onAddTransaction={addTransaction}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      {transactions.length === 0 && (
        <WelcomeGuide
          isOpen={showWelcomeGuide}
          onClose={() => setShowWelcomeGuide(false)}
        />
      )}
    </div>
  );
}
