"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Common/Loader";
import BillCard from "@/components/Bills/BillCard";
import { Bill } from "@/types/bill";

export default function BillsPage() {
  const { data: session } = useSession();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bills");
      if (!response.ok) {
        console.error("Failed to fetch bills:", response.statusText);
        setBills([]);
        return;
      }

      const data = await response.json();
      const billsArray = Array.isArray(data) ? data : [];
      setBills(billsArray);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bill");
      }

      await fetchBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete bill");
    }
  };

  const handleEdit = (bill: Bill) => {
    // Implement edit functionality
    console.log("Edit bill:", bill);
  };

  const calculateTotalMonthlyAmount = () => {
    return bills.reduce((total, bill) => {
      const monthlyAmount =
        bill.billingCycle === "yearly" ? bill.amount / 12 : bill.amount;
      return total + monthlyAmount;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">
          {session?.user?.name ? `${session.user.name}'s` : "Your"} Bills
        </h1>
        <button
          onClick={() => {
            /* Implement add new bill */
          }}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300"
        >
          Add Bill
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
              <BillCard
                key={bill._id}
                bill={bill}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {bills.length > 0 && (
            <div className="mt-6 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Monthly Cost:</span>
                <span className="text-xl font-bold text-white">
                  ₹{calculateTotalMonthlyAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
