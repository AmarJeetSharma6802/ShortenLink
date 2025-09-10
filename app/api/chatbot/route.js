import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);

    return NextResponse.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ reply: "Error: Unable to connect to AI." }, { status: 500 });
  }
}
