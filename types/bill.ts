export interface Bill {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string | Date;
  category: string;
  description?: string;
  imageUrl: string;
  billingCycle: "monthly" | "yearly";
  paid: boolean;
  createdAt: string | Date;
}

export const BILL_CATEGORIES = [
  "Utilities",
  "Rent",
  "Insurance",
  "Phone",
  "Internet",
  "Streaming",
  "Other",
] as const;

export const DEFAULT_BILL_SERVICES = [
  {
    name: "Jio",
    imageUrl: "/images/bills/jio.png",
    type: "mobile",
  },
  {
    name: "Airtel",
    imageUrl: "/images/bills/airtel.png",
    type: "mobile",
  },
  {
    name: "Vi",
    imageUrl: "/images/bills/vi.png",
    type: "mobile",
  },
  {
    name: "Jio Fiber",
    imageUrl: "/images/bills/jio.png",
    type: "wifi",
  },
  {
    name: "Airtel Xstream",
    imageUrl: "/images/bills/airtel.png",
    type: "wifi",
  },
] as const;
