"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";

interface Subscription {
  _id: string;
  userId: string;
  service: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: Date;
  imageUrl: string;
  active: boolean;
  createdAt: Date;
}

interface Service {
  id: string;
  name: string;
  imageUrl: string;
  defaultPrice: number;
}

const popularServices = [
  {
    id: "netflix",
    name: "Netflix",
    imageUrl: "/images/subscriptions/netflix.png",
    defaultPrice: 199,
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    imageUrl: "/images/subscriptions/prime.png",
    defaultPrice: 299,
  },
  {
    id: "spotify",
    name: "Spotify",
    imageUrl: "/images/subscriptions/spotify.png",
    defaultPrice: 119,
  },
  {
    id: "disney-plus",
    name: "Disney+ Hotstar",
    imageUrl: "/images/subscriptions/disney.png",
    defaultPrice: 299,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    imageUrl: "/images/subscriptions/youtube.png",
    defaultPrice: 129,
  },
];

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState(
    "/images/subscriptions/default.png"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageUrl =
        selectedService?.imageUrl || "/images/subscriptions/default.png";

      // If there's a custom image, upload it first
      if (customImage) {
        const formData = new FormData();
        formData.append("file", customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
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
        service: isCustom ? customName : selectedService?.name,
        amount: parseFloat(amount),
        billingCycle,
        imageUrl,
        nextBillingDate: new Date(),
        active: true,
      };

      console.log("Sending subscription data:", subscriptionData);

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add subscription");
      }

      const data = await response.json();
      console.log("Subscription creation response:", data);

      // Refresh subscriptions list
      await fetchSubscriptions();

      // Reset form
      setIsAddingNew(false);
      setSelectedService(null);
      setAmount("");
      setBillingCycle("monthly");
      setIsCustom(false);
      setCustomName("");
      setCustomImage(null);
      setCustomImageUrl("/images/subscriptions/default.png");
    } catch (error) {
      console.error("Error adding subscription:", error);
      alert("Failed to add subscription. Please try again.");
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let imageUrl = customImageUrl;

      // Handle new image upload if there is one and it's not a popular service
      if (
        customImage &&
        !popularServices.some((s) => s.name === editingSubscription?.service)
      ) {
        const formData = new FormData();
        formData.append("file", customImage);

        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
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
        service: customName,
        amount: parseFloat(amount),
        billingCycle,
        imageUrl,
        active: true,
      };

      const response = await fetch(
        `/api/subscriptions/${editingSubscription?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      await fetchSubscriptions();
      setIsEditing(false);
      setEditingSubscription(null);
      setCustomImage(null);
      setCustomImageUrl("/images/subscriptions/default.png");
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription");
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
          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub: Subscription) => (
              <div
                key={sub._id}
                className="p-4 rounded-xl border border-white/10 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-3 min-w-[200px]">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                      <Image
                        src={sub.imageUrl}
                        alt={sub.service}
                        fill
                        className="rounded-lg object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {sub.service}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400">
                        ₹{sub.amount} / {sub.billingCycle}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-auto">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
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

      {/* Add Subscription Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Add New Subscription
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddSubscription}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {popularServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedService(service);
                      setAmount(service.defaultPrice.toString());
                    }}
                    className={`p-2 sm:p-4 rounded-xl border ${
                      selectedService?.id === service.id
                        ? "border-blue-500"
                        : "border-white/10"
                    } hover:border-blue-500/50 transition-all duration-300`}
                  >
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm text-center text-gray-400">
                      {service.name}
                    </p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                    setSelectedService(null);
                    setAmount("");
                  }}
                  className={`p-2 sm:p-4 rounded-xl border ${
                    isCustom ? "border-blue-500" : "border-white/10"
                  } hover:border-blue-500/50 transition-all duration-300`}
                >
                  <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-center text-gray-400">Custom</p>
                </button>
              </div>

              {isCustom && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                    required
                  />
                  <label className="block text-sm font-medium text-gray-400 mt-3 mb-1">
                    Service Icon (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCustomImage(file);
                        setCustomImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                  step="0.01"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Billing Cycle
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    (isCustom && (!customName || !amount)) ||
                    (!isCustom && (!selectedService || !amount))
                  }
                  className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 disabled:opacity-50"
                >
                  Add Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subscription Modal */}
      {isEditing && editingSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Edit Subscription
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingSubscription(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                  required
                />
              </div>

              {/* Only show image upload for custom services */}
              {!popularServices.some(
                (s) => s.name === editingSubscription.service
              ) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Service Icon
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCustomImage(file);
                        setCustomImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                  step="0.01"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Billing Cycle
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Subscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
