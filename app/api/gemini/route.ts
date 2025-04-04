import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = 'あなたはGemini 2.5 proです。日本語で回答してください。他のAIと会話をしています。';
    
    const chat = model.startChat({
      history: geminiMessages,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(systemPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error('Google API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google API' },
      { status: 500 }
    );
  }
}
