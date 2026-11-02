// scripts/generate-pwa-icons.js
// Pure-Node PNG icon generator (no external deps).
// Draws the "JCU" mark: accent "J" monogram on a warm near-black canvas.
// Run: node scripts/generate-pwa-icons.js

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ── PNG encoding ──────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

// ── Canvas ────────────────────────────────────────────────────────────
class Canvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.buf = new Float32Array(w * h * 4); // premultiplied-ish straight alpha
  }

  blend(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const i = (y * this.w + x) * 4;
    const src = a > 1 ? 1 : a;
    const dstA = this.buf[i + 3];
    const outA = src + dstA * (1 - src);
    if (outA <= 0) return;
    this.buf[i] = (r * src + this.buf[i] * dstA * (1 - src)) / outA;
    this.buf[i + 1] = (g * src + this.buf[i + 1] * dstA * (1 - src)) / outA;
    this.buf[i + 2] = (b * src + this.buf[i + 2] * dstA * (1 - src)) / outA;
    this.buf[i + 3] = outA;
  }

  toBuffer() {
    const out = Buffer.alloc(this.w * this.h * 4);
    for (let i = 0; i < out.length; i++) {
      const v = this.buf[i];
      // Alpha is stored 0..1 internally, colour channels 0..255.
      const scaled = i % 4 === 3 ? v * 255 : v;
      out[i] = scaled <= 0 ? 0 : scaled >= 255 ? 255 : Math.round(scaled);
    }
    return out;
  }
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Fill the whole canvas with a vertical gradient. */
function fillGradient(c, top, bottom) {
  for (let y = 0; y < c.h; y++) {
    const t = c.h === 1 ? 0 : y / (c.h - 1);
    const r = top[0] + (bottom[0] - top[0]) * t;
    const g = top[1] + (bottom[1] - top[1]) * t;
    const b = top[2] + (bottom[2] - top[2]) * t;
    for (let x = 0; x < c.w; x++) c.blend(x, y, r, g, b, 1);
  }
}

/** Soft radial accent glow (additive feel), centred. */
function radialGlow(c, cx, cy, radius, color, maxAlpha) {
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const t = 1 - clamp01(d / radius);
      if (t <= 0) continue;
      const a = Math.pow(t, 2) * maxAlpha;
      c.blend(x, y, color[0], color[1], color[2], a);
    }
  }
}

function capsule(c, x0, y0, x1, y1, halfW, color, alpha = 1) {
  const pad = Math.ceil(halfW + 2);
  const minX = Math.max(0, Math.floor(Math.min(x0, x1) - pad));
  const maxX = Math.min(c.w - 1, Math.ceil(Math.max(x0, x1) + pad));
  const minY = Math.max(0, Math.floor(Math.min(y0, y1) - pad));
  const maxY = Math.min(c.h - 1, Math.ceil(Math.max(y0, y1) + pad));

  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5 - x0;
      const py = y + 0.5 - y0;
      let t = len2 === 0 ? 0 : (px * dx + py * dy) / len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(px - dx * t, py - dy * t);
      const cov = clamp01(halfW + 0.5 - d);
      if (cov > 0) c.blend(x, y, color[0], color[1], color[2], cov * alpha);
    }
  }
}

function circle(c, cx, cy, r, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(cx - r - 2));
  const maxX = Math.min(c.w - 1, Math.ceil(cx + r + 2));
  const minY = Math.max(0, Math.floor(cy - r - 2));
  const maxY = Math.min(c.h - 1, Math.ceil(cy + r + 2));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const cov = clamp01(r + 0.5 - d);
      if (cov > 0) c.blend(x, y, color[0], color[1], color[2], cov * alpha);
    }
  }
}

function roundRectSDF(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r);
  const qy = Math.abs(py - cy) - (hh - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}

function strokeRoundRect(c, cx, cy, hw, hh, r, halfW, color, alpha = 1) {
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const sdf = roundRectSDF(x + 0.5, y + 0.5, cx, cy, hw, hh, r);
      const cov = clamp01(halfW + 0.5 - Math.abs(sdf));
      if (cov > 0) c.blend(x, y, color[0], color[1], color[2], cov * alpha);
    }
  }
}

function fillRoundRect(c, cx, cy, hw, hh, r, color, alpha = 1) {
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const sdf = roundRectSDF(x + 0.5, y + 0.5, cx, cy, hw, hh, r);
      const cov = clamp01(0.5 - sdf);
      if (cov > 0) c.blend(x, y, color[0], color[1], color[2], cov * alpha);
    }
  }
}

/**
 * Draw the J monogram.
 * Local design space is 1x1; it is centred and scaled to the canvas.
 */
function drawMark(c, scale, color) {
  const S = c.w;
  const MX = 0.475; // mark bbox centre x in design space
  const MY = 0.46; // mark bbox centre y
  const t = (x, y) => [S * (0.5 + (x - MX) * scale), S * (0.5 + (y - MY) * scale)];
  const hw = 0.062 * S * scale;

  // Stem
  const [sx, sy0] = t(0.58, 0.24);
  const [, sy1] = t(0.58, 0.575);
  capsule(c, sx, sy0, sx, sy1, hw, color);

  // Hook: bottom half-ring, R = 0.105, same stroke width
  const [hx, hy] = t(0.475, 0.575);
  const R = 0.105 * S * scale;
  const minX = Math.max(0, Math.floor(hx - R - hw - 2));
  const maxX = Math.min(c.w - 1, Math.ceil(hx + R + hw + 2));
  const minY = Math.max(0, Math.floor(hy - R - hw - 2));
  const maxY = Math.min(c.h - 1, Math.ceil(hy + R + hw + 2));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const dy = py - hy;
      const dx = px - hx;
      const len = Math.hypot(dx, dy);
      const ring = clamp01(hw + 0.5 - Math.abs(len - R));
      const plane = clamp01(dy + 0.5); // keep the lower half only
      const cov = ring * plane;
      if (cov > 0) c.blend(x, y, color[0], color[1], color[2], cov);
    }
  }

  // Round caps so the arc ends are not blunt
  circle(c, hx + R, hy, hw, color);
  circle(c, hx - R, hy, hw, color);
}

function renderIcon(size, { markScale = 0.92, rounded = false } = {}) {
  const c = new Canvas(size, size);

  // Warm near-black vertical gradient (matches the dark theme)
  fillGradient(c, [0x1b, 0x1a, 0x18], [0x0e, 0x0d, 0x0c]);

  // Very soft amber glow behind the mark
  radialGlow(c, size * 0.5, size * 0.48, size * 0.62, [0xf5, 0x9e, 0x0b], 0.1);

  // Inner hairline (gives the icon a crafted edge on any launcher)
  const inset = size * 0.035;
  strokeRoundRect(
    c,
    size / 2,
    size / 2,
    size / 2 - inset,
    size / 2 - inset,
    size * 0.22,
    Math.max(1, size * 0.004),
    [0xff, 0xff, 0xff],
    0.07
  );

  drawMark(c, markScale, [0xf5, 0x9e, 0x0b]);

  // Optional rounded corners (transparent outside) for web favicons
  if (rounded) {
    const r = size * 0.22;
    const out = new Canvas(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const sdf = roundRectSDF(x + 0.5, y + 0.5, size / 2, size / 2, size / 2, size / 2, r);
        const cov = clamp01(0.5 - sdf);
        const i = (y * size + x) * 4;
        if (cov > 0) {
          out.buf[i] = c.buf[i];
          out.buf[i + 1] = c.buf[i + 1];
          out.buf[i + 2] = c.buf[i + 2];
          out.buf[i + 3] = c.buf[i + 3] * cov;
        }
      }
    }
    return out;
  }

  return c;
}

function writePNG(file, size, opts) {
  const canvas = renderIcon(size, opts);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, encodePNG(size, size, canvas.toBuffer()));
  console.log(`  ${path.relative(process.cwd(), file)}  (${size}x${size})`);
}

const root = path.resolve(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");

console.log("Generating PWA icons...");
writePNG(path.join(iconsDir, "icon-192.png"), 192, { markScale: 0.9 });
writePNG(path.join(iconsDir, "icon-512.png"), 512, { markScale: 0.9 });
writePNG(path.join(iconsDir, "icon-maskable-192.png"), 192, { markScale: 0.62 });
writePNG(path.join(iconsDir, "icon-maskable-512.png"), 512, { markScale: 0.62 });
writePNG(path.join(iconsDir, "apple-touch-icon.png"), 180, { markScale: 0.82 });

// Next.js app-router file conventions → automatic <link> tags
writePNG(path.join(root, "app", "icon.png"), 512, { markScale: 0.86, rounded: true });
writePNG(path.join(root, "app", "apple-icon.png"), 180, { markScale: 0.82 });

console.log("Done.");
