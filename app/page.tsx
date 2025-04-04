'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ClearButton from './components/ClearButton';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<number>(0);

  const handleClearConversation = () => {
    setMessages([]);
    setCurrentTurn(0);
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const perplexityResponse = await fetchPerplexityResearch(content);
      
      const perplexityMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        model: 'perplexity',
        content: perplexityResponse,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, perplexityMessage]);
      
      const chatGptResponse = await fetchChatGptResponse([...messages, userMessage, perplexityMessage]);
      
      const chatGptMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        model: 'chatgpt',
        content: chatGptResponse,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, chatGptMessage]);
      
      const claudeResponse = await fetchClaudeResponse([...messages, userMessage, perplexityMessage, chatGptMessage]);
      
      const claudeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        model: 'claude',
        content: claudeResponse,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, claudeMessage]);
      
      const geminiResponse = await fetchGeminiResponse([...messages, userMessage, perplexityMessage, chatGptMessage, claudeMessage]);
      
      const geminiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        model: 'gemini',
        content: geminiResponse,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, geminiMessage]);
      
      setCurrentTurn(prev => prev + 1);
    } catch (error) {
      console.error('Error in conversation flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerplexityResearch = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Perplexity API request failed');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching from Perplexity:', error);
      return 'Perplexityからの情報取得に失敗しました。';
    }
  };

  const fetchChatGptResponse = async (messageHistory: Message[]): Promise<string> => {
    try {
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });
      
      if (!response.ok) {
        throw new Error('ChatGPT API request failed');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching from ChatGPT:', error);
      return 'ChatGPTからの応答取得に失敗しました。';
    }
  };

  const fetchClaudeResponse = async (messageHistory: Message[]): Promise<string> => {
    try {
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Claude API request failed');
      }
      
      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error fetching from Claude:', error);
      return 'Claudeからの応答取得に失敗しました。';
    }
  };

  const fetchGeminiResponse = async (messageHistory: Message[]): Promise<string> => {
    try {
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error fetching from Gemini:', error);
      return 'Geminiからの応答取得に失敗しました。';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">AI 大喜利チャット</h1>
      
      <div className="flex justify-end mb-4">
        <ClearButton onClear={handleClearConversation} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>会話を始めるには、質問を入力してください。</p>
            <p className="mt-2 text-sm">各AIが日本語で回答します。</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      {isLoading && (
        <div className="text-center mt-4 text-gray-500">
          AIが考え中です...
        </div>
      )}
    </div>
  );
}
