import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

async function listModels() {
  const models = await genAI.listModels();
  console.log('Model Gemini yang tersedia:', models);
}

listModels(); 