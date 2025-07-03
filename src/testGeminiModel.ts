import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

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