import { useState, useEffect } from "react";
import { Bill } from "@/types/bill";

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onUpdate: (formData: {
    name: string;
    amount: string;
    dueDate: Date;
    category: string;
    description?: string;
    imageUrl: string;
    customImage?: File | null;
  }) => Promise<void>;
}

const BILL_CATEGORIES = [
  "Utilities",
  "Rent",
  "Insurance",
  "Phone",
  "Internet",
  "Other",
];

export default function EditBillModal({
  bill,
  isOpen,
  onClose,
  onUpdate,
}: EditBillModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setAmount(bill.amount.toString());
      setDueDate(new Date(bill.dueDate).toISOString().split("T")[0]);
      setCategory(bill.category);
      setDescription(bill.description || "");
      setCustomImageUrl(bill.imageUrl);
    }
  }, [bill]);

  if (!isOpen || !bill) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await onUpdate({
        name,
        amount,
        dueDate: new Date(dueDate),
        category,
        description,
        imageUrl: customImageUrl,
        customImage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-white/10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Bill</h2>
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
              Bill Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              required
            />
          </div>

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
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
            >
              {BILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Bill Icon
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
