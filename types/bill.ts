export interface Bill {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  description?: string;
  imageUrl: string;
  paid: boolean;
  createdAt: Date;
}

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
    name: "ACT",
    imageUrl: "/images/bills/act.png",
    type: "wifi",
  },
  {
    name: "Jio Fiber",
    imageUrl: "/images/bills/jio.png",
    type: "wifi",
  },
  {
    name: "Airtel Xstream",
    imageUrl: "/images/bills/airtel-fiber.png",
    type: "wifi",
  },
] as const;
