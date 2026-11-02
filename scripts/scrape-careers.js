// scripts/scrape-careers.js - Scrapes career pages of top Bangladesh software companies

const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const pages = [
  { name: 'Brain Station 23', url: 'https://brainstation-23.easy.jobs' },
  { name: 'BJIT', url: 'https://bjitgroup.com/career' },
  { name: 'Vivasoft', url: 'https://vivasoftltd.com/career/' },
  { name: 'Therap BD', url: 'https://therapbd.com/business-analysis/' },
  { name: 'Cefalo', url: 'https://career.cefalo.com/' },
  { name: 'Selise', url: 'https://ats.hirebee.ai/en/company/jobs/selise-bangladesh-ltd' },
  { name: 'ITclan BD', url: 'https://itclanbd.com/careers' },
];

async function main() {
  const results = [];
  
  for (const page of pages) {
    try {
      const res = await fetchUrl(page.url);
      const text = stripHtml(res.html);
      const result = {
        name: page.name,
        url: page.url,
        status: res.status,
        textLength: text.length,
        preview: text.slice(0, 300),
        hasJobs: /job|position|opening|developer|engineer|career|vacanc/i.test(text),
      };
      results.push(result);
      console.log(`=== ${page.name} ===`);
      console.log(`Status: ${res.status} | Text: ${text.length} chars`);
      console.log(`Has Jobs: ${result.hasJobs}`);
      console.log(`Preview: ${text.slice(0, 200)}...`);
      console.log('');
    } catch (err) {
      results.push({ name: page.name, url: page.url, status: 'ERROR', error: err.message });
      console.error(`Error: ${page.name} - ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  const fs = require('fs');
  fs.writeFileSync('C:\\Users\\joyud\\Desktop\\Projects\\portfolio\\career_scrape_results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to career_scrape_results.json in project root');
}

main().catch(console.error);
