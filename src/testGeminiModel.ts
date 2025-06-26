import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function testModel() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Halo, siapa kamu?');
    console.log('Jawaban:', result.response.text());
  } catch (err) {
    console.error('Error:', err);
  }
}

testModel(); 