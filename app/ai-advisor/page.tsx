import { Metadata } from "next";
import AIChatInterface from "@/components/AI/AIChatInterface";

export const metadata: Metadata = {
  title: "AI Financial Advisor | FinTrac",
  description: "Get personalized financial advice from our AI advisor",
};

export default function AIAdvisorPage() {
  return (
    <main className="h-[calc(100vh-64px)]">
      <div className="container h-full mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto h-full">
          <AIChatInterface />
        </div>
      </div>
    </main>
  );
}
