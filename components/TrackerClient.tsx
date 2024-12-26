"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TransactionDashboard from "./TransactionDashboard";
import Loader from "./Common/Loader";
import { useEffect, useState } from "react";
import { Transaction } from "@/models/Transaction";

export default function TrackerClient() {
  const { data: session, status: sessionStatus } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      console.log("Checking auth - Session Status:", sessionStatus);
      try {
        if (sessionStatus === "authenticated") {
          console.log("NextAuth session found");
          setIsAuthenticated(true);
          return;
        }

        console.log("No NextAuth session, checking JWT auth");
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });

        if (response.ok) {
          console.log("JWT auth successful");
          setIsAuthenticated(true);
        } else {
          console.log("No valid authentication found, redirecting");
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setError("Authentication failed");
        router.push("/");
      }
    }

    if (sessionStatus !== "loading") {
      checkAuth();
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    async function fetchTransactions() {
      if (!isAuthenticated) return;

      console.log("Fetching transactions - isAuthenticated:", isAuthenticated);
      try {
        setLoading(true);
        const response = await fetch("/api/transactions", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Transactions fetched successfully:", data.length, "items");
        setTransactions(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [isAuthenticated]);

  if (sessionStatus === "loading") {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  console.log(
    "Rendering TransactionDashboard with transactions:",
    transactions.length
  );
  return <TransactionDashboard initialTransactions={transactions} />;
}
