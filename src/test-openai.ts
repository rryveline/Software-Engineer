// Hapus: import dotenv from 'dotenv';
// Hapus: dotenv.config();

console.log('ENV OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY);

import { callOpenAI } from './lib/openai.js';

async function testOpenAI() {
  try {
    const result = await callOpenAI([
      { role: 'user', content: 'Halo, siapa kamu?' }
    ]);
    console.log('OpenAI response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testOpenAI(); 