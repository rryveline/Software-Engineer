import dotenv from 'dotenv';
dotenv.config();

import { callOpenAI } from './lib/openai.js';

// Contoh data crawling
const dataCrawling = [
  { title: 'Berita 1', content: 'Isi berita 1 tentang teknologi AI.' },
  { title: 'Berita 2', content: 'Isi berita 2 tentang perkembangan startup di Indonesia.' },
  { title: 'Berita 3', content: 'Isi berita 3 tentang pendidikan di era digital.' },
];

// Fungsi untuk membuat prompt dari data crawling dan pertanyaan user
function buildPrompt(data: { title: string; content: string }[], question: string) {
  const crawlingText = data.map(item => `${item.title}: ${item.content}`).join('\n');
  return `Berikut adalah data hasil crawling:\n${crawlingText}\n\nJawablah pertanyaan berikut berdasarkan data di atas:\n${question}`;
}

// Fungsi utama chatbot
async function chatbotWithCrawling(question: string) {
  const prompt = buildPrompt(dataCrawling, question);
  const response = await callOpenAI([
    { role: 'system', content: 'Kamu adalah asisten yang hanya menjawab berdasarkan data crawling yang diberikan.' },
    { role: 'user', content: prompt }
  ]);
  console.log('Jawaban Chatbot:', response);
}

// Contoh penggunaan
const pertanyaanUser = 'Apa saja perkembangan terbaru tentang AI?';
chatbotWithCrawling(pertanyaanUser); 