export interface Message {
  role: "user" | "assistant";
  content: string;
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
  message: string;
  structured?: {
    summary: string;
    advice?: string[];
    metrics?: ChatMetrics;
  };
}
