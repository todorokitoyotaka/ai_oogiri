export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: 'perplexity' | 'chatgpt' | 'claude' | 'gemini';
  timestamp: number;
}

export interface ConversationHistory {
  messages: Message[];
}
