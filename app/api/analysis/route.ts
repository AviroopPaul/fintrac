import { NextResponse } from "next/server";
import { Transaction } from "@/models/Transaction";
import Groq from "groq-sdk";
import { getSession } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateAnalysisPrompt = (transactions: Transaction[]) => {
  return `Analyze these financial transactions and provide insights:
1. Identify spending patterns and trends
2. Suggest potential areas for savings
3. Highlight unusual transactions or patterns
4. Provide personalized financial advice

Transactions data:
${JSON.stringify(transactions, null, 2)}

Please provide the analysis in this JSON format:
{
  "patterns": [string],
  "savingsSuggestions": [string],
  "unusualActivity": [string],
  "advice": [string]
}`;
};

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactions } = await request.json();

    // Verify that these transactions belong to the authenticated user
    if (
      !transactions.every((t: Transaction) => t.user_id === session.user.id)
    ) {
      return NextResponse.json(
        { error: "Unauthorized access to transactions" },
        { status: 403 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: generateAnalysisPrompt(transactions),
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const data = completion.choices[0]?.message?.content;
    if (!data) {
      throw new Error("No response from AI");
    }

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze transactions" },
      { status: 500 }
    );
  }
}
