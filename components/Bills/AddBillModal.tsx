import Image from "next/image";
import { useState } from "react";
import { DEFAULT_BILL_SERVICES, BILL_CATEGORIES } from "@/types/bill";

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    amount: string;
    category: string;
    description?: string;
    imageUrl: string;
    customImage?: File | null;
  }) => Promise<void>;
}

export default function AddBillModal({
  isOpen,
  onClose,
  onSubmit,
}: AddBillModalProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [selectedService, setSelectedService] = useState<
    (typeof DEFAULT_BILL_SERVICES)[number] | null
  >(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [customName, setCustomName] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState(
    "/images/bills/default.png"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    BILL_CATEGORIES[0].toLowerCase()
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onSubmit({
      name: isCustom ? customName : selectedService!.name,
      amount: amount,
      category: isCustom ? selectedCategory : selectedService!.type,
      description: description,
      imageUrl: isCustom ? customImageUrl : selectedService!.imageUrl,
      customImage: customImage,
    });
  };

  const resetForm = () => {
    setIsCustom(false);
    setSelectedService(null);
    setAmount("");
    setDescription("");
    setCustomName("");
    setCustomImage(null);
    setCustomImageUrl("/images/bills/default.png");
    setSelectedCategory(BILL_CATEGORIES[0].toLowerCase());
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category.toLowerCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add New Bill</h2>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {DEFAULT_BILL_SERVICES.map((service) => (
              <button
                key={service.name}
                type="button"
                onClick={() => {
                  setIsCustom(false);
                  setSelectedService(service);
                }}
                className={`p-2 sm:p-4 rounded-xl border ${
                  selectedService?.name === service.name
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
                Bill Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
                required
              />
              <label className="block text-sm font-medium text-gray-400 mt-3 mb-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {BILL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.toLowerCase()
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-gray-400 mt-3 mb-1">
                Bill Icon (optional)
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
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-white/10 text-white"
              rows={3}
            />
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
              Add Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
