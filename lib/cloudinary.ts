/**
 * Cloudinary signed uploads for public learning materials.
 *
 * Files are uploaded straight from the browser to Cloudinary — the server
 * only hands out a short-lived signature, so large PDFs/zips never pass
 * through a serverless function body limit.
 *
 * Required env:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import crypto from "crypto";

export type CloudinaryResourceType = "image" | "video" | "raw";

export const CLOUDINARY_RESOURCE_TYPES: CloudinaryResourceType[] = [
  "image",
  "video",
  "raw",
];

/** 25 MB — keeps a single upload cheap and cache-friendly. */
export const CLOUDINARY_MAX_FILE_BYTES = 25 * 1024 * 1024;

export const CLOUDINARY_ALLOWED_FORMATS: Record<CloudinaryResourceType, string[]> = {
  image: ["png", "jpg", "jpeg", "webp", "avif"],
  video: ["mp4", "webm"],
  // `raw` is Cloudinary's bucket for documents.
  raw: ["pdf", "zip", "md", "txt", "json", "csv"],
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function cloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  };
}

/**
 * Cloudinary signature: sort params alphabetically, join `k=v` with `&`,
 * append the API secret, SHA-1 the whole string.
 */
export function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

function safeSegment(value: string | null | undefined, fallback: string): string {
  const cleaned = (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return cleaned || fallback;
}

/** Deterministic Cloudinary folder for a roadmap position. */
export function buildLearnFolder(
  roadmapSlug: string,
  phaseSlug?: string | null,
  stepSlug?: string | null,
): string {
  return [
    "learn",
    safeSegment(roadmapSlug, "roadmap"),
    safeSegment(phaseSlug, "_phase"),
    safeSegment(stepSlug, "_step"),
  ].join("/");
}

export function cloudinaryUploadUrl(
  cloudName: string,
  resourceType: CloudinaryResourceType,
): string {
  return `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
}

/**
 * Best-effort MIME type from a Cloudinary format/extension. Used when the
 * browser does not report a type for raw uploads.
 */
export function mimeFromFormat(format: string): string {
  const map: Record<string, string> = {
    pdf: "application/pdf",
    zip: "application/zip",
    md: "text/markdown",
    txt: "text/plain",
    json: "application/json",
    csv: "text/csv",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
    mp4: "video/mp4",
    webm: "video/webm",
  };
  return map[format.toLowerCase()] || "application/octet-stream";
}
