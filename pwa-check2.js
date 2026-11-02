(async () => {
  const base = "http://localhost:3015";

  // Icons dimensions
  const checkIcon = async (url) => {
    const r = await fetch(base + url);
    if (!r.ok) { return url + " -> MISSING (" + r.status + ")"; }
    const buf = Buffer.from(await r.arrayBuffer());
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return url + " -> " + w + "x" + h + " (" + buf.length + " bytes)";
  };

  for (const f of ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-192.png", "/icons/icon-maskable-512.png", "/icons/apple-touch-icon.png"]) {
    console.log(await checkIcon(f));
  }

  // Manifest content - check name lengths (mobile install constraint)
  const m = await (await fetch(base + "/manifest.webmanifest")).json();
  console.log("");
  console.log("Manifest name '" + m.name + "' length=" + m.name.length + " (should be <=40 for short_name, <=80 for name)");
  console.log("short_name '" + m.short_name + "' length=" + m.short_name.length + " (should be <=12)");
  console.log("start_url:", m.start_url);
  console.log("display:", m.display);
  console.log("orientation:", m.orientation);
  console.log("theme_color:", m.theme_color);
  console.log("background_color:", m.background_color);
  console.log("icons count:", m.icons.length);
  console.log("shortcuts count:", m.shortcuts.length);
  console.log("");

  // Check for errors
  const errors = [];
  if (m.short_name.length > 12) errors.push("short_name > 12 chars: " + m.short_name.length);
  if (m.name.length > 80) errors.push("name > 80 chars: " + m.name.length);
  if (!m.icons || m.icons.length < 2) errors.push("need >=2 icons, have " + m.icons?.length);
  console.log("Install constraint errors:", errors.length ? errors.join("; ") : "NONE");
})();