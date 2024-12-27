export interface Subscription {
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

export interface Service {
  id: string;
  name: string;
  imageUrl: string;
  defaultPrice: number;
}
// Export the default services from the constants file
export { DEFAULT_SERVICES } from "../constants/subscriptions";
