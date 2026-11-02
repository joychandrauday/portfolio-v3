(async () => {
  const base = "http://localhost:3015";
  const html = await (await fetch(base + "/")).text();
  console.log("beforeinstallprompt:", html.includes("beforeinstallprompt"));
  console.log("theme-color count:", (html.match(/name="theme-color"/g) || []).length);
  console.log("apple capable:", html.includes("apple-mobile-web-app-capable"));
  console.log("sw register:", html.includes("ServiceWorkerRegister") || html.includes("sw.js"));
})();