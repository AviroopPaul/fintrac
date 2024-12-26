import { useState, useEffect } from "react";
import { Subscription } from "@/types/subscription";
import { popularServices } from "@/constants/subscriptions";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onUpdate: (formData: {
    service: string;
    amount: string;
    billingCycle: "monthly" | "yearly";
    imageUrl: string;
    customImage?: File | null;
  }) => Promise<void>;
}

export default function EditSubscriptionModal({
  subscription,
  isOpen,
  onClose,
  onUpdate,
}: EditSubscriptionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [customName, setCustomName] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (subscription) {
      setAmount(subscription.amount?.toString() || "0");
      setBillingCycle(subscription.billingCycle || "monthly");
      setCustomName(subscription.service || "");
      setCustomImageUrl(subscription.imageUrl || "");
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onUpdate({
      service: customName,
      amount: amount,
      billingCycle: billingCycle,
      imageUrl: customImageUrl,
      customImage: customImage,
    });
  };

  const isPopularService = popularServices.some(
    (s) => s.name === subscription.service
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-white/10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Subscription</h2>
          <button
            type="button"
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              disabled={isPopularService}
              required
            />
          </div>

          {!isPopularService && (
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
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Billing Cycle
            </label>
            <select
              value={billingCycle}
              onChange={(e) =>
                setBillingCycle(e.target.value as "monthly" | "yearly")
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating || !amount || !customName}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
