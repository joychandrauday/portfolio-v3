(async () => {
  const base = "http://localhost:3015";
  const checks = [];

  const m = await fetch(base + "/manifest.webmanifest");
  checks.push("manifest: " + m.status + " " + m.headers.get("content-type"));

  const sw = await fetch(base + "/sw.js");
  checks.push("sw: " + sw.status + " " + sw.headers.get("cache-control") + " allowed=" + sw.headers.get("service-worker-allowed"));

  for (const f of ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-192.png", "/icons/icon-maskable-512.png", "/icons/apple-touch-icon.png"]) {
    const r = await fetch(base + f);
    checks.push(f.substring(1) + ": " + r.status + " " + r.headers.get("content-type").split(";")[0]);
  }

  const html = await (await fetch(base + "/")).text();
  const head = html.split("</head>")[0];
  checks.push("manifest link: " + /rel="manifest"/.test(head));
  checks.push("theme-color occurrences: " + (head.match(/name="theme-color"/g) || []).length);
  checks.push("apple capable: " + /apple-mobile-web-app-capable" content="yes"/.test(head));
  checks.push("viewport-fit: " + /viewport-fit=cover/.test(head));

  for (const c of checks) console.log(c);
})();