import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'pplx-7b-online',
        messages: [
          {
            role: 'system',
            content: 'あなたは最新の情報を調査するリサーチャーです。日本語で回答してください。'
          },
          {
            role: 'user',
            content: `以下のトピックについて最新の情報を調査してください: ${query}`
          }
        ],
        options: {
          stream: false
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Perplexity API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Perplexity API' },
      { status: 500 }
    );
  }
}
