"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Common/Loader";
import SubscriptionCard from "@/components/Subscriptions/SubscriptionCard";
import AddSubscriptionModal from "@/components/Subscriptions/AddSubscriptionModal";
import EditSubscriptionModal from "@/components/Subscriptions/EditSubscriptionModal";
import { Subscription } from "@/types/subscription";
import { popularServices } from "@/constants/subscriptions";

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState(
    "/images/subscriptions/default.png"
  );
  const [customName, setCustomName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

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
                <span className="text-xl font-bold text-white">
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
    </div>
  );
}
