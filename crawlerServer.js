import 'dotenv/config';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
const port = 4000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_URLS = [
  'https://www.unklab.ac.id/',
  'https://www.unklab.ac.id/pimpinan/',
  'https://www.unklab.ac.id/fasilitas/',
  'https://www.unklab.ac.id/biaya-perkuliahan/'
];

let isCrawling = false;

// Fungsi untuk mengambil konten utama
function extractMainContent($) {
  let main = $('main').text();
  if (main && main.trim().length > 50) return main.trim();
  let article = $('article').text();
  if (article && article.trim().length > 50) return article.trim();
  // Fallback: body tanpa header/footer
  $('header, footer, nav, script, style').remove();
  let body = $('body').text();
  return body.trim();
}

async function getOpenAIEmbedding(text, apiKey) {
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      }),
    });
    const data = await res.json();
    return data.data?.[0]?.embedding || null;
  } catch (e) {
    console.error('OpenAI embedding error:', e);
    return null;
  }
}

// Recursive crawling seluruh website
async function crawlAll(url, visited, maxPages = Infinity) {
  if (visited.size >= maxPages) return;
  if (visited.has(url)) return;
  visited.add(url);
  try {
    const { data } = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(data);
    const title = $('title').text().trim() || url;
    const content = extractMainContent($).replace(/\s+/g, ' ').substring(0, 10000);
    const embedding = await getOpenAIEmbedding(content, process.env.OPENAI_API_KEY);
    await supabase.from('crawled_data').insert([{
      title,
      content,
      category: 'auto',
      source_type: 'auto_crawl',
      status: 'success',
      url,
      created_by: null,
      embedding,
    }]);
    // Cari link internal
    const links = [];
    $('a[href]').each((_, el) => {
      const link = $(el).attr('href');
      if (!link) return;
      // Hanya link internal
      if (link.startsWith('mailto:') || link.startsWith('tel:')) return;
      let nextUrl = link.startsWith('http') ? link : 'https://www.unklab.ac.id' + (link.startsWith('/') ? link : '/' + link);
      if (nextUrl.startsWith('https://www.unklab.ac.id') && !visited.has(nextUrl)) {
        links.push(nextUrl);
      }
    });
    // Crawl link-link baru (depth first, stop jika sudah maxPages)
    for (const nextUrl of links) {
      if (visited.size >= maxPages) break;
      await crawlAll(nextUrl, visited, maxPages);
    }
  } catch (err) {
    console.error('Gagal crawl:', url, err.message);
  }
}

// Endpoint crawling seluruh website
app.post('/start-crawling', async (req, res) => {
  if (isCrawling) {
    return res.status(409).json({ message: 'Crawling already in progress' });
  }
  isCrawling = true;
  res.json({ message: 'Crawling seluruh website dimulai' });
  await crawlAll('https://www.unklab.ac.id/', new Set());
  isCrawling = false;
  console.log('Crawling seluruh website selesai.');
});

// Endpoint crawling demo (5 halaman saja)
app.post('/start-crawling-demo', async (req, res) => {
  if (isCrawling) {
    return res.status(409).json({ message: 'Crawling already in progress' });
  }
  isCrawling = true;
  res.json({ message: 'Demo crawling (5 halaman) dimulai' });
  await crawlAll('https://www.unklab.ac.id/', new Set(), 5);
  isCrawling = false;
  console.log('Demo crawling (5 halaman) selesai.');
});

app.listen(port, () => {
  console.log(`Crawler server listening at http://localhost:${port}`);
});
