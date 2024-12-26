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

    const systemPrompt = `You are a strictly finance-focused AI advisor. Your FIRST and MOST IMPORTANT task for EVERY message is to determine if it's finance-related.

IMPORTANT VALIDATION RULES:
1. You must evaluate EACH message independently, regardless of previous context or conversation
2. If a message is not EXPLICITLY about finance, respond ONLY with this EXACT text:
"I apologize, but I can only assist with finance-related questions. Please feel free to ask me about:
- Personal finance and budgeting
- Investment advice
- Banking queries
- Financial planning
- Economic topics
- Spending analysis
- Savings strategies"

3. NO EXCEPTIONS to this rule - even if previous messages were finance-related
4. NO additional commentary or explanations allowed for non-finance questions
5. Do not attempt to find financial angles in non-financial questions

RESPONSE STYLE REQUIREMENTS:
1. Keep responses SHORT and CRISP - aim for 2-3 paragraphs maximum
2. Be direct and get to the point quickly
3. Avoid unnecessary explanations or verbose context
4. Focus on actionable advice and key insights
5. Use bullet points for lists instead of long paragraphs
6. Limit examples to one or two most relevant ones

Examples of non-finance questions to reject (ALWAYS):
- Technology questions (even if about prices)
- Shopping recommendations
- General life advice
- Business operations (unless specifically about finance)
- Career questions (unless specifically about compensation)
- Health-related questions
- Travel questions
- Food or restaurant questions

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

    // Check if the response is the rejection message and ensure it's passed through exactly
    const rejectionMessage =
      "I apologize, but I can only assist with finance-related questions. Please feel free to ask me about:\n- Personal finance and budgeting\n- Investment advice\n- Banking queries\n- Financial planning\n- Economic topics\n- Spending analysis\n- Savings strategies";

    // Return the response in the format expected by AIChatInterface
    return NextResponse.json({
      response:
        response.trim() === rejectionMessage.trim()
          ? rejectionMessage
          : response,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
