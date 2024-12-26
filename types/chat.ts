export interface Message {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export interface ChatMetrics {
  totalIncome?: number;
  totalExpenses?: number;
  totalSpending?: number;
  topCategories?: Array<{
    category: string;
    amount: number;
  }>;
}

export interface ChatResponse {
  response: string;
}
