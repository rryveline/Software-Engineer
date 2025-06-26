process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://www.unklab.ac.id';
const visited = new Set();

const MAX_DEPTH = 3;
const DELAY_MS = 1000;

async function crawlPage(url, depth = 0) {
  if (visited.has(url) || !url.startsWith(BASE_URL) || depth > MAX_DEPTH) return;
  visited.add(url);

  try {
    const { data } = await axios.get(url, { timeout: 20000 });
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
      await crawlPage(nextUrl, depth + 1);
    }
  } catch (err) {
    console.error('Gagal crawl:', url, err.message);
  }
}

// Pilihan interval
const scheduleOptions = {
  '3jam': '0 */3 * * *',
  '6jam': '0 */6 * * *',
  '24jam': '0 0 * * *'
};

// Pilih interval di sini:
const INTERVAL = process.env.CRAWL_INTERVAL || '3jam';
const cronPattern = scheduleOptions[INTERVAL];

// Jalankan crawling otomatis sesuai jadwal
cron.schedule(cronPattern, async () => {
  console.log(`[${new Date().toLocaleString()}] Mulai crawling otomatis...`);
  visited.clear();
  await crawlPage(BASE_URL);
  console.log('Crawling selesai.');
});

(async () => {
  console.log('Crawling pertama kali...');
  await crawlPage(BASE_URL);
  console.log('Crawling selesai.');
})();