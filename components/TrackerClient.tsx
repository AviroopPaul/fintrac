'use client';

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import TransactionDashboard from "./TransactionDashboard";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { Transaction } from "@/models/Transaction";

export default function TrackerClient() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    }
    if (session) fetchTransactions();
  }, [session]);

  if (status === "loading" || loading) {
    return <Loader />;
  }

  if (!session) {
    return null; // We'll let the useEffect handle the redirect
  }

  return <TransactionDashboard initialTransactions={transactions} />;
} 