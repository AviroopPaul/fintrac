import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import Groq from "groq-sdk";
import dbConnect from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { message, rawResponse } = await request.json();

    // Get user's transactions for context using mongoose
    const transactions = await Transaction.find({ user_id: session.user.id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    const systemPrompt = rawResponse
      ? `You are a helpful AI financial advisor. Provide natural responses based on the transaction data.`
      : `You are a helpful AI financial advisor. Analyze the transaction data and provide your response in this format:

         First, provide a brief summary of the financial situation.
         
         Then, list specific recommendations prefixed with "•" on new lines.
         
         Finally, if relevant, show key metrics like:
         • Total Spending: $X
         • Top spending categories with amounts
         
         Do not include any JSON formatting or tags. Keep the response concise and actionable.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${systemPrompt}
          
          Recent transactions: ${JSON.stringify(transactions)}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    // Return the response directly without JSON parsing
    return NextResponse.json({
      message: response,
      structured: null, // Remove structured field since we're not using JSON anymore
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
