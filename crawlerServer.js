process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'dotenv/config';
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

const BASE_URL = 'https://www.unklab.ac.id';
const MAX_DEPTH = 2;
const DELAY_MS = 800; // Faster delay
const AXIOS_TIMEOUT = 20000; // 20s timeout

let isCrawling = false;

async function crawlPage(url, visited, depth = 0) {
  if (visited.has(url) || !url.startsWith(BASE_URL) || depth > MAX_DEPTH) return;
  visited.add(url);

  try {
    const { data } = await axios.get(url, { timeout: AXIOS_TIMEOUT });
    const $ = cheerio.load(data);

    const title = $('title').text().trim() || url;
    const content = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000);

    await supabase.from('crawled_data').insert([{
      title,
      content,
      category: 'auto',
      source_type: 'auto_crawl',
      status: 'success',
      url,
      created_by: null
    }]);

    const links = [];
    $('a[href]').each((_, el) => {
      const link = $(el).attr('href');
      if (link && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
        let nextUrl = link.startsWith('http') ? link : BASE_URL + (link.startsWith('/') ? link : '/' + link);
        if (nextUrl.startsWith(BASE_URL) && !visited.has(nextUrl)) {
          links.push(nextUrl);
        }
      }
    });

    for (const nextUrl of links) {
      await new Promise(res => setTimeout(res, DELAY_MS));
      await crawlPage(nextUrl, visited, depth + 1);
    }
  } catch (err) {
    console.error('Gagal crawl:', url, err.message);
  }
}

app.post('/start-crawling', async (req, res) => {
  if (isCrawling) {
    return res.status(409).json({ message: 'Crawling already in progress' });
  }
  isCrawling = true;
  res.json({ message: 'Crawling started' });

  const visited = new Set();
  await crawlPage(BASE_URL, visited);
  isCrawling = false;
  console.log('Crawling selesai.');
});

app.listen(port, () => {
  console.log(`Crawler server listening at http://localhost:${port}`);
}); 