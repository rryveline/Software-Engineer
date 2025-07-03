// Hapus: import dotenv from 'dotenv';
// Hapus: dotenv.config();

import { callGemini } from './lib/gemini.js';

// Contoh data crawling
const dataCrawling = [
  { title: 'Berita 1', content: 'Isi berita 1 tentang teknologi AI.' },
  { title: 'Berita 2', content: 'Isi berita 2 tentang perkembangan startup di Indonesia.' },
  { title: 'Berita 3', content: 'Isi berita 3 tentang pendidikan di era digital.' },
];

function buildPrompt(data, question) {
  const crawlingText = data.map(item => `${item.title}: ${item.content}`).join('\n');
  return `Berikut adalah data hasil crawling:\n${crawlingText}\n\nJawablah pertanyaan berikut berdasarkan data di atas:\n${question}`;
}

async function chatbotWithGemini(question) {
  const prompt = buildPrompt(dataCrawling, question);
  const response = await callGemini([
    { role: 'user', content: prompt }
  ]);
  console.log('Jawaban Chatbot:', response);
}

const pertanyaanUser = 'Apa saja perkembangan terbaru tentang AI?';
chatbotWithGemini(pertanyaanUser); 