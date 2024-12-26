import Image from "next/image";
import { Subscription, DEFAULT_SERVICES } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  // Function to get service image URL
  const getServiceImageUrl = (serviceName: string): string => {
    const defaultService = DEFAULT_SERVICES.find(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase()
    );
    return defaultService?.imageUrl || subscription.imageUrl;
  };

  return (
    <div className="p-4 rounded-xl border border-white/10 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3 min-w-[200px]">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <Image
              src={getServiceImageUrl(subscription.service)}
              alt={subscription.service}
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {subscription.service}
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              ₹{subscription.amount} / {subscription.billingCycle}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 ml-auto">
          <button
            onClick={() => onEdit(subscription)}
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
            onClick={() => onDelete(subscription._id)}
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
  );
}
