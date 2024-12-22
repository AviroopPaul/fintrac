export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "expense" | "income";
  user_id: string;
}
