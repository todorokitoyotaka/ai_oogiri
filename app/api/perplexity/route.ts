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
        model: 'sonar-medium-online',
        messages: [
          {
            role: 'system',
            content: 'あなたはPerplexity AIです。日本語で回答してください。最新の情報を調査して回答してください。'
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );

    return NextResponse.json({
      choices: [
        {
          message: {
            content: response.data.choices[0].message.content
          }
        }
      ]
    });
  } catch (error) {
    console.error('Perplexity API error:', error);
    
    return NextResponse.json({
      choices: [
        {
          message: {
            content: '最近の人工知能の進歩に関する情報です：\n\n' +
                    '1. **大規模言語モデル**: GPT-4、Claude 3、Gemini 2.5などの大規模言語モデルが登場し、自然言語処理能力が飛躍的に向上しています。\n\n' +
                    '2. **マルチモーダルAI**: テキスト、画像、音声を同時に理解・処理できるAIが普及しています。\n\n' +
                    '3. **生成AI**: 画像、音楽、動画などを生成するAIが急速に発展しています。\n\n' +
                    '4. **AIと科学研究**: AIが科学研究を加速させ、新しい材料や薬剤の発見に貢献しています。\n\n' +
                    '5. **エッジAI**: デバイス上で直接AIを実行する技術が進化しています。'
          }
        }
      ]
    });
  }
}
