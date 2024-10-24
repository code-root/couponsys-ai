// app/api/gemini/route.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextResponse } from "next/server";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-1.5-pro",
  maxOutputTokens: 2048,
});

// Define the system prompt for marketing data science assistant
const systemPrompt = `
You are an experienced Data Science Marketing Assistant with expertise in:
- Marketing campaign analysis and optimization
- A/B testing and experimental design
- Customer segmentation and targeting
- ROI and performance metrics analysis
- Budget allocation optimization
- Channel effectiveness analysis
- Customer behavior prediction

For each marketing question or scenario:
1. Analyze the available data and context
2. Provide data-driven recommendations
3. Consider multiple scenarios and their potential outcomes
4. Suggest specific metrics to track
5. Highlight potential risks and mitigation strategies
6. When relevant, recommend A/B testing approaches

Always structure your responses with:
- Key findings
- Actionable recommendations
- Metrics to track
- Potential risks
- Next steps

Base all recommendations on data science principles and marketing best practices.`;

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Create messages array with system prompt and user input
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(prompt)
    ];

    // Call Gemini using LangChain
    const response = await model.invoke(messages);

    return NextResponse.json({
      content: response.content,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}