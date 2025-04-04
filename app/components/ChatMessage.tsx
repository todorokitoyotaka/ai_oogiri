import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const modelNames = {
  perplexity: 'Perplexity AI',
  chatgpt: 'ChatGPT 4o',
  claude: 'Claude 3.7',
  gemini: 'Gemini 2.5 pro',
};

const modelColors = {
  user: 'bg-gray-200',
  perplexity: 'bg-purple-100',
  chatgpt: 'bg-green-100',
  claude: 'bg-blue-100',
  gemini: 'bg-yellow-100',
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const bgColor = isUser 
    ? modelColors.user 
    : message.model 
      ? modelColors[message.model] 
      : 'bg-gray-100';
  
  const displayName = isUser 
    ? '人間' 
    : message.model 
      ? modelNames[message.model] 
      : 'AI';

  return (
    <div className={`p-4 rounded-lg mb-4 ${bgColor}`}>
      <div className="font-bold mb-2">{displayName}</div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  );
}
