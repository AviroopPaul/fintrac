import { Metadata } from "next";
import AIChatInterface from "@/components/AI/AIChatInterface";

export const metadata: Metadata = {
  title: "AI Financial Advisor | FinTrac",
  description: "Get personalized financial advice from our AI advisor",
};

export default function AIAdvisorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">
          AI Financial Advisor
        </h1>
        <AIChatInterface />
      </div>
    </main>
  );
}
