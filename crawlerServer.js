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

async function crawlDemo() {
  for (const url of DEMO_URLS) {
    try {
      const { data } = await axios.get(url, { timeout: 10000 });
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
      await new Promise(res => setTimeout(res, 500)); // Delay singkat
    } catch (err) {
      console.error('Gagal crawl:', url, err.message);
    }
  }
}

app.post('/start-crawling', async (req, res) => {
  if (isCrawling) {
    return res.status(409).json({ message: 'Crawling already in progress' });
  }
  isCrawling = true;
  res.json({ message: 'Demo crawling started' });

  await crawlDemo();
  isCrawling = false;
  console.log('Demo crawling selesai.');
});

app.listen(port, () => {
  console.log(`Crawler server listening at http://localhost:${port}`);
});
