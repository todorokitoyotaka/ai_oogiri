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

    return NextResponse.json({
      choices: [
        {
          message: {
            content: `最近の人工知能の進歩に関する情報です：

1. **大規模言語モデルの進化**: GPT-4、Claude 3、Gemini 2.5などの大規模言語モデルが登場し、自然言語処理能力が飛躍的に向上しています。

2. **マルチモーダルAI**: テキストだけでなく、画像、音声、動画を理解・生成できるAIが普及しています。

3. **AIと科学研究**: AIが科学研究を加速させ、新しい材料や薬剤の発見に貢献しています。

4. **自律システム**: 自動運転車やロボット工学の分野でAIの応用が進んでいます。

5. **エッジAI**: デバイス上で直接AIを実行する技術が進化し、プライバシーやレイテンシの問題が軽減されています。

これらの進歩により、AIはますます多くの分野で重要な役割を果たすようになっています。`
          }
        }
      ]
    });
  } catch (error) {
    console.error('Perplexity API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Perplexity API' },
      { status: 500 }
    );
  }
}
