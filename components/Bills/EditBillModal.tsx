import { useState, useEffect } from "react";
import { Bill, BILL_CATEGORIES } from "@/types/bill";
import Image from "next/image";

interface EditBillModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    updatedBill: Partial<Bill> & { customImage?: File | null }
  ) => Promise<void>;
}

export default function EditBillModal({
  bill,
  isOpen,
  onClose,
  onUpdate,
}: EditBillModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "0",
    dueDate: new Date().toISOString().split("T")[0],
    category: BILL_CATEGORIES[0],
    description: "",
    billingCycle: "monthly" as "monthly" | "yearly",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");

  // Update form data when bill changes
  useEffect(() => {
    if (bill) {
      const dueDate =
        bill.dueDate instanceof Date ? bill.dueDate : new Date(bill.dueDate);

      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: new Date().toISOString().split("T")[0],
        category: bill.category as (typeof BILL_CATEGORIES)[number],
        description: bill.description || "",
        billingCycle: bill.billingCycle as "monthly" | "yearly",
        imageUrl: bill.imageUrl || "",
      });
      setPreviewImageUrl(bill.imageUrl || "");
    }
  }, [bill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate({
        ...formData,
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate),
        customImage: customImage,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update bill:", error);
      alert("Failed to update bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 p-6 rounded-xl border border-white/10 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Bill</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Bill Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Bill Icon
            </label>
            <div className="flex items-center gap-4 mb-2">
              {previewImageUrl && (
                <div className="relative w-12 h-12">
                  <Image
                    src={previewImageUrl}
                    alt="Bill icon preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCustomImage(file);
                    setPreviewImageUrl(URL.createObjectURL(file));
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as (typeof BILL_CATEGORIES)[number],
                })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
            >
              {BILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Billing Cycle
            </label>
            <select
              value={formData.billingCycle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  billingCycle: e.target.value as "monthly" | "yearly",
                })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
