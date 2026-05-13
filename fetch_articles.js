const https = require('https');
const http = require('http');

const BASE = 'https://www.ithome.com';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getArticleTitles() {
  try {
    const html = await fetchUrl(BASE + '/');
    
    // Extract unique article links  
    const linkRegex = /\/0\/(\d+)\/(\d+)\.htm/g;
    const links = [];
    const seen = new Set();
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const url = `https://www.ithome.com/0/${match[1]}/${match[2]}.htm`;
      if (!seen.has(url)) {
        seen.add(url);
        links.push(url);
      }
    }

    const articles = links.slice(0, 22);
    console.log(`Found ${articles.length} articles, fetching...\n`);

    for (let i = 0; i < articles.length; i++) {
      try {
        const articleHtml = await fetchUrl(articles[i]);
        const titleMatch = articleHtml.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(/ - IT之家$/, '').trim() : 'NO TITLE';
        const imgMatch = articleHtml.match(/data-original="([^"]+\.(?:jpg|png|webp))"/);
        const img = imgMatch ? imgMatch[1] : 'NO_IMAGE';
        const dateMatch = articleHtml.match(/time"[^>]*datetime="([^"]+)"/);
        const date = dateMatch ? dateMatch[1].substring(0, 10) : '';
        
        console.log(`${String(i+1).padStart(2)}. ${title}`);
        console.log(`   ${articles[i]}`);
        if (img !== 'NO_IMAGE') console.log(`   img: ${img.substring(0, 70)}`);
        if (date) console.log(`   date: ${date}`);
        console.log('');
      } catch(e) {
        console.log(`${i+1}. ERROR: ${e.message}`);
      }
    }

    // Cleanup temp file
    const fs = require('fs');
    try { fs.unlinkSync('ithome_list.html'); } catch(e) {}

  } catch(e) {
    console.error('Error:', e.message);
  }
}

getArticleTitles();
