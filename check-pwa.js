const http = require('http');
const chunks = [];
http.get('http://localhost:3015/', (res) => {
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const html = Buffer.concat(chunks).toString();
    console.log('has beforeinstallprompt:', html.includes('beforeinstallprompt'));
    console.log('theme-color count:', (html.match(/name="theme-color"/g) || []).length);
    console.log('apple capable:', html.includes('apple-mobile-web-app-capable'));
    console.log('has manifest link:', /rel="manifest"/.test(html));
    console.log('has apple-touch-icon:', /apple-touch-icon/.test(html));
    console.log('has viewport-fit:', /viewport-fit=cover/.test(html));
  });
}).on('error', e => console.log('http error:', e.message));