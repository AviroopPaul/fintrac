import Image from "next/image";
import { Bill, DEFAULT_BILL_SERVICES } from "@/types/bill";

interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
}

export default function BillCard({ bill, onEdit, onDelete }: BillCardProps) {
  const getServiceImageUrl = (serviceName: string): string => {
    const defaultService = DEFAULT_BILL_SERVICES.find(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase()
    );
    return defaultService?.imageUrl || bill.imageUrl;
  };

  return (
    <div className="p-4 rounded-xl border border-white/10 backdrop-blur-xl shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src={getServiceImageUrl(bill.name)}
                alt={bill.name}
                fill
                className="rounded-lg object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {bill.name}
              </h3>
              <p className="text-sm sm:text-base text-white">₹{bill.amount}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(bill)}
              className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors"
              aria-label="Edit bill"
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
              onClick={() => onDelete(bill._id)}
              className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors"
              aria-label="Delete bill"
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

        {/* Description section */}
        {bill.description && (
          <p className="text-sm text-gray-400 border-t border-white/10 pt-2">
            {bill.description}
          </p>
        )}
      </div>
    </div>
  );
}
