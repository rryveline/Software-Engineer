import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

export async function callGemini(messages: { role: string; content: string }[], model = 'gemini-pro') {
  const chat = genAI.getGenerativeModel({ model }).startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
} 