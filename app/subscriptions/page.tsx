"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Common/Loader";
import SubscriptionCard from "@/components/Subscriptions/SubscriptionCard";
import AddSubscriptionModal from "@/components/Subscriptions/AddSubscriptionModal";
import EditSubscriptionModal from "@/components/Subscriptions/EditSubscriptionModal";
import { Subscription } from "@/types/subscription";
import { popularServices } from "@/constants/subscriptions";
import BillCard from "@/components/Bills/BillCard";
import { Bill } from "@/types/bill";
import AddBillModal from "@/components/Bills/AddBillModal";
import EditBillModal from "@/components/Bills/EditBillModal";

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);

  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState(
    "/images/subscriptions/default.png"
  );
  const [customName, setCustomName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const [isAddingBill, setIsAddingBill] = useState(false);
  const [isEditingBill, setIsEditingBill] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscriptions");
      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Failed to fetch subscriptions:", response.statusText);
        setSubscriptions([]);
        return;
      }

      const data = await response.json();
      console.log("Raw response data:", data);

      // Extra validation
      if (!data) {
        console.error("No data received from API");
        setSubscriptions([]);
        return;
      }

      // Ensure we're working with an array
      const subscriptionsArray = Array.isArray(data) ? data : [];
      console.log("Processed subscriptions array:", subscriptionsArray);

      setSubscriptions(subscriptionsArray);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = async (formData: {
    service: string;
    amount: string;
    billingCycle: "monthly" | "yearly";
    imageUrl: string;
    customImage?: File | null;
  }) => {
    try {
      let imageUrl = "/images/subscriptions/default.png";

      if (formData.customImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Using default image instead.");
        }
      }

      const subscriptionData = {
        service: formData.service,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle,
        imageUrl,
        active: true,
      };

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add subscription");
      }

      await fetchSubscriptions();
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add subscription"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      await fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      alert("Failed to delete subscription");
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditing(true);
    setAmount(subscription.amount.toString());
    setBillingCycle(subscription.billingCycle);
    setCustomName(subscription.service);
    setCustomImageUrl(subscription.imageUrl);
  };

  const handleUpdate = async (formData: {
    service: string;
    amount: string;
    billingCycle: "monthly" | "yearly";
    imageUrl: string;
    customImage?: File | null;
  }) => {
    setIsUpdating(true);

    try {
      if (!editingSubscription?._id) {
        throw new Error("No subscription ID found for update");
      }

      let imageUrl = formData.imageUrl;

      if (
        formData.customImage &&
        !popularServices.some((s) => s.name === editingSubscription.service)
      ) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Using existing image instead.");
        }
      }

      const subscriptionData = {
        service: formData.service,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle,
        imageUrl,
        active: true,
      };

      const response = await fetch(
        `/api/subscriptions/${editingSubscription._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subscription");
      }

      await fetchSubscriptions();
      setIsEditing(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update subscription"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateTotalMonthlyAmount = () => {
    return subscriptions.reduce((total, sub) => {
      const monthlyAmount =
        sub.billingCycle === "yearly"
          ? sub.amount / 12 // Convert yearly to monthly
          : sub.amount;
      return total + monthlyAmount;
    }, 0);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsEditingBill(true);
  };

  const handleDeleteBill = async (billId: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bills/${billId}`, {
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

  const handleAddBill = async (formData: {
    name: string;
    amount: string;
    dueDate: Date;
    category: string;
    description?: string;
    imageUrl: string;
    customImage?: File | null;
  }) => {
    try {
      let imageUrl = "/images/bills/default.png";

      if (formData.customImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Using default image instead.");
        }
      }

      const billData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
        description: formData.description,
        imageUrl,
      };

      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add bill");
      }

      // Fetch updated bills
      await fetchBills();
      setIsAddingBill(false);
    } catch (error) {
      console.error("Error adding bill:", error);
      alert(error instanceof Error ? error.message : "Failed to add bill");
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch("/api/bills");
      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleUpdateBill = async (updatedBill: Partial<Bill>) => {
    if (!editingBill?._id) return;

    try {
      let imageUrl = updatedBill.imageUrl || editingBill.imageUrl;

      if (updatedBill.customImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", updatedBill.customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Using existing image instead.");
        }
      }

      const billData = {
        ...editingBill,
        ...updatedBill,
        imageUrl,
        amount: updatedBill.amount
          ? parseFloat(updatedBill.amount.toString())
          : editingBill.amount,
      };

      const response = await fetch(`/api/bills/${editingBill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bill");
      }

      await fetchBills();
      setIsEditingBill(false);
      setEditingBill(null);
    } catch (error) {
      console.error("Error updating bill:", error);
      alert(error instanceof Error ? error.message : "Failed to update bill");
    }
  };

  const calculateTotalBillAmount = () => {
    return bills.reduce((total, bill) => {
      return total + bill.amount;
    }, 0);
  };

  const groupBillsByCategory = () => {
    const grouped: { [key: string]: Bill[] } = {};
    bills.forEach((bill) => {
      if (!grouped[bill.category]) {
        grouped[bill.category] = [];
      }
      grouped[bill.category].push(bill);
    });
    return grouped;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">
          {session?.user?.name ? `${session.user.name}'s` : "Your"}{" "}
          Subscriptions
        </h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300"
        >
          Add Subscription
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub._id}
                subscription={sub}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Total Monthly Cost */}
          {subscriptions.length > 0 && (
            <div className="mt-6 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Monthly Cost:</span>
                <span className="text-xl font-bold text-green-400">
                  ₹{calculateTotalMonthlyAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      <AddSubscriptionModal
        isOpen={isAddingNew}
        onClose={() => setIsAddingNew(false)}
        onSubmit={handleAddSubscription}
      />

      <EditSubscriptionModal
        subscription={editingSubscription}
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingSubscription(null);
        }}
        onUpdate={handleUpdate}
      />

      {/* Add a divider */}
      <hr className="my-8 border-white/10" />

      {/* Bills Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Bills</h2>
          <button
            onClick={() => setIsAddingBill(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300"
          >
            Add Bill
          </button>
        </div>

        {Object.entries(groupBillsByCategory()).map(
          ([category, categoryBills]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-white/80 mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryBills.map((bill) => (
                  <BillCard
                    key={bill._id}
                    bill={bill}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {/* Add Bills Total */}
        {bills.length > 0 && (
          <div className="mt-6 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Bills Amount:</span>
              <span className="text-xl font-bold text-green-400">
                ₹{calculateTotalBillAmount().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      <AddBillModal
        isOpen={isAddingBill}
        onClose={() => setIsAddingBill(false)}
        onSubmit={handleAddBill}
      />

      {/* Edit Bill Modal */}
      <EditBillModal
        bill={editingBill}
        isOpen={isEditingBill}
        onClose={() => {
          setIsEditingBill(false);
          setEditingBill(null);
        }}
        onUpdate={handleUpdateBill}
      />
    </div>
  );
}
