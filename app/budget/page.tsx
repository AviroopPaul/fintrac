"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Budget } from "@/models/Budget";
import { Transaction } from "@/models/Transaction";
import { PlusIcon } from "@heroicons/react/24/outline";

import BudgetForm from "@/components/Budget/BudgetForm";
import BudgetList from "@/components/Budget/BudgetList";
import TransactionList from "@/components/Dashboard/TransactionList";
import Loader from "@/components/Common/Loader";

export default function BudgetPage() {
  const { data: session, status } = useSession();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "", amount: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/");
  }

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(allTransactions)) {
      console.error("allTransactions is not an array:", allTransactions);
      return [];
    }

    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return transactionMonth === selectedMonth;
    });
  }, [allTransactions, selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch budgets for the selected month
        const budgetResponse = await fetch(
          `/api/budgets?month=${selectedMonth}`,
          {
            credentials: "include",
          }
        );
        const budgetData = await budgetResponse.json();

        // Fetch all transactions
        const transactionResponse = await fetch("/api/transactions", {
          credentials: "include",
        });
        const transactionData = await transactionResponse.json();

        // Ensure transactionData is an array before setting state
        if (Array.isArray(transactionData)) {
          setAllTransactions(transactionData);
        } else {
          console.error("Transaction data is not an array:", transactionData);
          setAllTransactions([]);
        }

        // Calculate spent amounts for each budget using filtered transactions
        const spentByCategory = filteredTransactions.reduce(
          (acc: Record<string, number>, t: Transaction) => {
            if (t.type === "expense") {
              acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
          },
          {}
        );

        // Update budgets with spent amounts
        const updatedBudgets = budgetData.map((budget: Budget) => ({
          ...budget,
          spent: spentByCategory[budget.category] || 0,
        }));
        setBudgets(updatedBudgets);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllTransactions([]); // Reset to empty array on error
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchData();
    }
  }, [session?.user?.email, selectedMonth]); // Keep selectedMonth in dependencies to refetch budgets

  const handleAddBudget = async (budget: {
    category: string;
    amount: number;
  }) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...budget,
          month: selectedMonth,
        }),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setBudgets([...budgets, newBudget]);
        setIsAddingBudget(false);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setAllTransactions(allTransactions.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${updatedTransaction._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (response.ok) {
        setAllTransactions(
          allTransactions.map((t) =>
            t._id === updatedTransaction._id ? updatedTransaction : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const response = await fetch(`/api/budgets?id=${budgetId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete budget");

      // Update local state by filtering out the deleted budget
      setBudgets(budgets.filter((budget) => budget._id !== budgetId));
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleUpdateBudget = async (
    budgetId: string,
    updatedBudget: Partial<Budget>
  ) => {
    try {
      const response = await fetch(`/api/budgets?id=${budgetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedBudget),
      });

      if (!response.ok) throw new Error("Failed to update budget");

      // Update local state by mapping through budgets and updating the modified one
      setBudgets(
        budgets.map((budget) =>
          budget._id === budgetId ? { ...budget, ...updatedBudget } : budget
        )
      );
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const formattedMonth = new Date(selectedMonth + "-01").toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-6 text-white">
          {session?.user?.name ? `${session.user.name}'s` : "Monthly"} Budget
        </h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [color-scheme:dark]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Summary Section */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Budget Goals</h2>
            <button
              onClick={() => setIsAddingBudget(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Budget
            </button>
          </div>

          <BudgetForm
            isOpen={isAddingBudget}
            onSubmit={handleAddBudget}
            onCancel={() => setIsAddingBudget(false)}
          />

          <BudgetList
            budgets={budgets}
            transactions={filteredTransactions}
            onDelete={handleDeleteBudget}
            onUpdate={handleUpdateBudget}
          />
        </div>

        {/* Transactions Section */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
          <TransactionList
            transactions={filteredTransactions}
            onDelete={handleDeleteTransaction}
            onUpdate={handleUpdateTransaction}
          />
        </div>
      </div>
    </div>
  );
}
