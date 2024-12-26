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

    const systemPrompt = `You are a strictly finance-focused AI advisor. You MUST FIRST evaluate if the user's question is directly related to personal finance, financial planning, banking, investments, budgeting, or economics.

For ANY question that is not EXPLICITLY related to finance, you must IMMEDIATELY respond with ONLY this message, with no additional commentary:

"I apologize, but I can only assist with finance-related questions. Please feel free to ask me about:
- Personal finance and budgeting
- Investment advice
- Banking queries
- Financial planning
- Economic topics
- Spending analysis
- Savings strategies"

Examples of non-finance questions to reject:
- Questions about technology, even if they mention prices
- Questions about shopping recommendations
- General life advice, even if it has financial implications
- Questions about business operations (unless specifically about business finance)
- Questions about careers (unless specifically about salary/compensation)

For valid finance-related queries, follow these guidelines when responding:

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
   - Use tables with | for comparing data
   - Include percentages and specific numbers when relevant
   - Use \`\`\` for code blocks or calculations

4. For transaction analysis:
   - Focus on spending patterns and trends
   - Identify unusual activities or potential areas of concern
   - Suggest actionable improvements
   - Quantify savings opportunities where possible

Remember: If there is ANY doubt about whether a question is finance-related, default to providing the rejection message.`;

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
