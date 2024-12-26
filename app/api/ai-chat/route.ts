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
    const { message, messages } = await request.json();

    // Get user's transactions for context using mongoose
    const transactions = await Transaction.find({ user_id: session.user.id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    const systemPrompt = `You are a helpful AI financial advisor. Follow these guidelines when responding:

1. Use markdown formatting for clear presentation:
   - Use **bold** for important points (without backticks)
   - Use *italics* for emphasis (without backticks)
   - Use proper line breaks with double newlines between paragraphs
   - Use \`\`\` for code or numerical blocks
   - Use --- for horizontal rules (without backticks)

2. Structure your response with:
   - A clear summary at the top
   - Bulleted lists using - for main points
   - Numbered lists (1., 2., etc.) for sequential steps
   - Headers using ## for main sections (without backticks)
   - Sub-headers using ### for subsections (without backticks)

3. When presenting data:
   - Treat all monetary values as Indian Rupees (₹) unless explicitly marked with $ in the transactions
   - Format monetary values consistently (e.g., ₹1,234.56)
   - Use tables with | for comparing data (example):
     | Category | Amount |
     |----------|--------|
     | Income   | ₹1,000 |
   - Include percentages and specific numbers when relevant
   - Use \`\`\` for code blocks or calculations

4. For transaction analysis:
   - Focus on spending patterns and trends
   - Identify unusual activities or potential areas of concern
   - Suggest actionable improvements
   - Quantify savings opportunities where possible

Keep responses professional yet conversational, and ensure proper markdown formatting for optimal readability.`;

    // Convert previous messages to the format expected by Groq
    const previousMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nRecent transactions: ${JSON.stringify(
            transactions
          )}`,
        },
        ...previousMessages,
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

    // Return the response in the format expected by AIChatInterface
    return NextResponse.json({
      response: response,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
