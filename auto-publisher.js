/**
 * China IT News - Auto Publisher
 * 
 * 定时自动执行：
 * 1. 扒IT之家最新文章
 * 2. 跟已发布记录去重
 * 3. AI翻译成英文 + 改写
 * 4. 下载配图
 * 5. 写入 articles.ts
 * 6. 更新 PUBLISHED_RECORD.md
 * 7. git push 上线
 * 
 * 用法：node auto-publisher.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============ 配置 ============
const PROJECT_DIR = __dirname;
const ARTICLES_FILE = path.join(PROJECT_DIR, 'src', 'data', 'articles.ts');
const RECORD_FILE = path.join(PROJECT_DIR, 'PUBLISHED_RECORD.md');
const IMAGES_DIR = path.join(PROJECT_DIR, 'public', 'images', 'articles');
const TYPES_FILE = path.join(PROJECT_DIR, 'src', 'types', 'article.ts');

const ARK_API_KEY = 'caba7440-96cf-45ea-a226-915a2eb60589';
const ARK_MODEL = 'doubao-seed-2-0-lite-260428';
const ARK_URL = 'ark.cn-beijing.volces.com';

const MAX_ARTICLES_PER_RUN = 3; // 每次最多发3篇，控制批量

// ============ 工具函数 ============

function fetchUrl(url, useProxy = false) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const opts = {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    };
    mod.get(url, opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function proxyFetchUrl(url) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: 7890,
      path: url,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };
    https.get(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function askAI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: ARK_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });
    const req = https.request({
      hostname: ARK_URL,
      path: '/api/v3/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ARK_API_KEY
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.choices?.[0]?.message?.content || '');
        } catch (e) {
          reject('AI parse error: ' + d.substring(0, 100));
        }
      });
    });
    req.write(body);
    req.end();
  });
}

function getNextId(existingIds) {
  let maxId = 0;
  existingIds.forEach(id => {
    const n = parseInt(id);
    if (n > maxId) maxId = n;
  });
  return (maxId + 1).toString();
}

function readRecordedIds() {
  if (!fs.existsSync(RECORD_FILE)) return new Set();
  const content = fs.readFileSync(RECORD_FILE, 'utf-8');
  const ids = new Set();
  const regex = /\|\s*\d+\s*\|.*?\|\s*https:\/\/www\.ithome\.com\/0\/(\d+\/\d+)\.htm\s*\|/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

function getExistingArticleIds() {
  const content = fs.readFileSync(ARTICLES_FILE, 'utf-8');
  const ids = [];
  const regex = /id:\s*'(\d+)'/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function downloadImage(url, filename) {
  return new Promise((resolve) => {
    try {
      const f = fs.createWriteStream(filename);
      const mod = url.startsWith('https') ? https : http;
      mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        res.pipe(f);
        f.on('finish', () => { f.close(); resolve(true); });
      }).on('error', () => resolve(false));
    } catch (e) {
      resolve(false);
    }
  });
}

function extractImageUrl(html) {
  const m = html.match(/data-original="([^"]+\.(?:jpg|png|webp)[^"]*)"/);
  if (m) return m[1].split('?')[0];
  // fallback: try src
  const m2 = html.match(/src="(https:\/\/img[^"]+\.(?:jpg|png|webp)[^"]*)"/);
  return m2 ? m2[1].split('?')[0] : '';
}

function extractContent(html) {
  // Get text from the article body
  const m = html.match(/<div class="post_content "[^>]*id="paragraph"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="shareto"/i);
  if (m) {
    // Get text content including <p> tags
    const content = m[1];
    const paras = [];
    const pRegex = /<p>([\s\S]*?)<\/p>/g;
    let pm;
    while ((pm = pRegex.exec(content)) !== null) {
      const text = stripTags(pm[1]).trim();
      if (text.length > 5) paras.push(text);
    }
    return paras.join('\n\n').substring(0, 3000);
  }
  // Fallback: extract all paragraphs
  const paras = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/g;
  let pm;
  let count = 0;
  while ((pm = pRegex.exec(html)) !== null && count < 15) {
    const text = stripTags(pm[1]).trim();
    if (text.length > 20) { paras.push(text); count++; }
  }
  return paras.join('\n\n').substring(0, 3000);
}

function stripTags(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function categorize(title, content) {
  const lower = (title + ' ' + content).toLowerCase();
  if (lower.includes('ai') || lower.includes('大模型') || lower.includes('llm') || lower.includes('人工智能')) return 'ai';
  if (lower.includes('芯片') || lower.includes('chip') || lower.includes('半导体') || lower.includes('semiconductor') || lower.includes('hynix') || lower.includes('smic')) return 'chip';
  if (lower.includes('ev') || lower.includes('电动') || lower.includes('汽车') || lower.includes('byd') || lower.includes('xiaomi') && lower.includes('su7')) return 'ev';
  if (lower.includes('出海') || lower.includes('overseas') || lower.includes('global') || lower.includes('tiktok') || lower.includes('temu')) return 'overseas';
  return 'gadgets'; // 默认消费科技
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function getTodayDate() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// ============ 主流程 ============

async function main() {
  console.log('=== China IT News Auto Publisher ===\n');

  // 1. 抓IT之家首页文章列表
  console.log('[1/6] Fetching IT之家 latest articles...');
  const html = await fetchUrl('https://www.ithome.com/');
  const linkRegex = /\/0\/(\d+\/\d+)\.htm/g;
  const unique = new Set();
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    unique.add(m[1]);
  }
  const allLinks = Array.from(unique);
  console.log(`  Found ${allLinks.length} articles`);

  // 2. 去重
  console.log('[2/6] Checking against published records...');
  const recordedIds = readRecordedIds();
  const newLinks = [];
  for (const link of allLinks) {
    if (!recordedIds.has(link)) {
      newLinks.push(link);
    }
  }
  console.log(`  New un-published articles: ${newLinks.length}`);

  if (newLinks.length === 0) {
    console.log('  No new articles to publish. Done!');
    return;
  }

  // 3. 逐篇处理（最多MAX_ARTICLES_PER_RUN篇）
  const toProcess = newLinks.slice(0, MAX_ARTICLES_PER_RUN);
  console.log(`[3/6] Processing ${toProcess.length} articles...`);

  const existingIds = getExistingArticleIds();
  let newEntries = [];
  let recordEntries = [];

  for (let i = 0; i < toProcess.length; i++) {
    const linkId = toProcess[i];
    const url = 'https://www.ithome.com/0/' + linkId + '.htm';
    console.log(`\n  --- Article ${i+1}: ${url} ---`);
    
    try {
      // 3a. 抓文章内容
      const articleHtml = await fetchUrl(url);
      const titleMatch = articleHtml.match(/<title>(.*?)<\/title>/);
      const rawTitle = titleMatch ? titleMatch[1].replace(/ - IT之家$/, '').trim() : '';
      
      if (!rawTitle) {
        console.log('  SKIP: No title found');
        continue;
      }
      console.log(`  Title: ${rawTitle}`);

      // 3b. 提取配图
      const imgUrl = extractImageUrl(articleHtml);
      let localImgName = '';
      if (imgUrl) {
        const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
        localImgName = slugify(rawTitle) + ext;
        const localPath = path.join(IMAGES_DIR, localImgName);
        console.log(`  Downloading image...`);
        await downloadImage(imgUrl, localPath);
      }

      // 3c. 提取正文并AI翻译
      const content = extractContent(articleHtml);
      console.log(`  Content length: ${content.length} chars`);
      
      const translatePrompt = `Translate this Chinese tech news into English for an international audience. 
Write in a professional news style. Include context that helps foreign readers understand.
Output ONLY the English version, no explanations.

Title: ${rawTitle}

Content:
${content.substring(0, 2500)}`;

      console.log('  AI translating...');
      const englishContent = await askAI(translatePrompt);
      
      // Extract title and body from AI response
      const lines = englishContent.split('\n').filter(l => l.trim());
      let title = rawTitle;
      let body = englishContent;
      
      // Try to extract title if AI provides one
      const firstLine = lines[0]?.replace(/^#\s*/, '').replace(/^\*\*(.*)\*\*$/, '$1').trim();
      if (firstLine && firstLine.length > 10 && firstLine.length < 200) {
        title = firstLine;
        body = lines.slice(1).join('\n').trim() || englishContent;
      }

      // 3d. 生成摘要
      const summaryPrompt = `Summarize this English tech news in one sentence (max 25 words):\n\n${body.substring(0, 1000)}`;
      const summary = await askAI(summaryPrompt);

      // 3e. 生成文章数据
      const newId = getNextId(existingIds);
      existingIds.push(newId);
      const slug = slugify(title);
      const category = categorize(rawTitle, content);
      const today = getTodayDate();

      // Escape single quotes in strings
      const safeTitle = title.replace(/'/g, "\\'");
      const safeSummary = summary.replace(/'/g, "\\'").substring(0, 150);
      const safeBody = body.replace(/`/g, '\\`').replace(/'/g, "\\'");

      newEntries.push({
        id: newId,
        title: safeTitle,
        slug,
        summary: safeSummary,
        content: safeBody,
        category,
        tags: extractTags(rawTitle, content),
        author: 'China Tech Insider',
        date: today,
        image: localImgName ? '/images/articles/' + localImgName : 'https://images.unsplash.com/photo-1677442136019-17141602294d?w=800'
      });

      recordEntries.push({
        num: newId,
        title: rawTitle,
        url: url,
        id: '0/' + linkId
      });

      console.log(`  ✅ Published as: "${safeTitle}"`);
      console.log(`  Category: ${category}`);

      // 防速冻，等2秒
      await new Promise(r => setTimeout(r, 2000));

    } catch (e) {
      console.log('  ❌ Error:', e.message);
    }
  }

  if (newEntries.length === 0) {
    console.log('\nNo valid articles to publish. Done!');
    return;
  }

  // 4. 写入 articles.ts
  console.log(`\n[4/6] Writing ${newEntries.length} articles to articles.ts...`);
  
  let articlesContent = fs.readFileSync(ARTICLES_FILE, 'utf-8');
  
  // Find the insert position (before the last ]);
  const insertPos = articlesContent.lastIndexOf('];');
  
  let newData = '';
  for (const entry of newEntries) {
    newData += `  {\n`;
    newData += `    id: '${entry.id}',\n`;
    newData += `    title: '${entry.title}',\n`;
    newData += `    slug: '${entry.slug}',\n`;
    newData += `    summary: '${entry.summary}',\n`;
    newData += `    content: \`${entry.content}\`,\n`;
    newData += `    category: '${entry.category}',\n`;
    newData += `    tags: ${JSON.stringify(entry.tags)},\n`;
    newData += `    author: '${entry.author}',\n`;
    newData += `    publishedAt: '${entry.date}',\n`;
    newData += `    imageUrl: '${entry.image}',\n`;
    newData += `  },\n`;
  }
  
  articlesContent = articlesContent.slice(0, insertPos) + newData + articlesContent.slice(insertPos);
  fs.writeFileSync(ARTICLES_FILE, articlesContent, 'utf-8');
  console.log('  ✅ articles.ts updated');

  // 5. 更新 PUBLISHED_RECORD.md
  console.log('[5/6] Updating published record...');
  let recordContent = fs.readFileSync(RECORD_FILE, 'utf-8');
  
  // Find the table area and add entries
  const tableEnd = recordContent.lastIndexOf('|');
  let newRows = '';
  for (const entry of recordEntries) {
    newRows += `| ${entry.num} | ${entry.title} | ${entry.url} | ${entry.id} |\n`;
  }
  
  // Insert before the last blank line or end of file
  const lastNewline = recordContent.lastIndexOf('\n', recordContent.length - 2);
  recordContent = recordContent.slice(0, lastNewline) + '\n' + newRows + recordContent.slice(lastNewline);
  fs.writeFileSync(RECORD_FILE, recordContent, 'utf-8');
  console.log('  ✅ Record updated');

  // 6. git push
  console.log('[6/6] Pushing to GitHub...');
  try {
    const gitEnv = Object.assign({}, process.env, { PATH: process.env.PATH + ';' + process.env.GIT_PATH });
    execSync('git add .', { cwd: PROJECT_DIR, stdio: 'pipe', env: gitEnv });
    execSync('git commit -m "Auto publish ' + newEntries.length + ' articles [bot]"', { cwd: PROJECT_DIR, stdio: 'pipe', env: gitEnv });
    execSync('git push', { cwd: PROJECT_DIR, stdio: 'pipe', env: gitEnv });
    console.log('  ✅ Successfully deployed to Vercel!');
  } catch (e) {
    console.log('  ⚠️ Git push error:', e.message);
    console.log('  (May need to push manually)');
  }

  console.log(`\n=== Done! Published ${newEntries.length} new articles ===`);
}

function extractTags(title, content) {
  const tags = ['China Tech'];
  const lower = (title + ' ' + content).toLowerCase();
  
  if (lower.includes('华为') || lower.includes('huawei')) tags.push('Huawei');
  if (lower.includes('小米') || lower.includes('xiaomi')) tags.push('Xiaomi');
  if (lower.includes('苹果') || lower.includes('apple') || lower.includes('iphone')) tags.push('Apple');
  if (lower.includes('微信') || lower.includes('wechat') || lower.includes('tencent') || lower.includes('腾讯')) tags.push('Tencent');
  if (lower.includes('阿里') || lower.includes('alibaba')) tags.push('Alibaba');
  if (lower.includes('抖音') || lower.includes('tiktok') || lower.includes('字节')) tags.push('ByteDance');
  if (lower.includes('byd') || lower.includes('比亚迪')) tags.push('BYD');
  if (lower.includes('chip') || lower.includes('芯片') || lower.includes('semiconductor')) tags.push('Semiconductor');
  if (lower.includes('ai') || lower.includes('人工智能')) tags.push('AI');
  if (lower.includes('5g') || lower.includes('6g')) tags.push('5G/6G');
  if (lower.includes('自动驾驶') || lower.includes('self-driving') || lower.includes('autonomous')) tags.push('Autonomous Driving');
  if (lower.includes('手机') || lower.includes('smartphone') || lower.includes('phone')) tags.push('Smartphone');
  
  return tags;
}

main().catch(e => console.error('Fatal error:', e));
