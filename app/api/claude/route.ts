import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key is not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      system: 'あなたはClaude 3.7です。日本語で回答してください。他のAIと会話をしています。',
      messages: formattedMessages,
      max_tokens: 1000,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Anthropic API' },
      { status: 500 }
    );
  }
}
