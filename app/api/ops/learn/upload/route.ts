import { NextRequest, NextResponse } from "next/server";
import { verifyOpsSession } from "@/lib/auth";
import {
  CLOUDINARY_ALLOWED_FORMATS,
  CLOUDINARY_MAX_FILE_BYTES,
  CLOUDINARY_RESOURCE_TYPES,
  buildLearnFolder,
  cloudinaryConfig,
  cloudinaryUploadUrl,
  isCloudinaryConfigured,
  signCloudinaryParams,
  type CloudinaryResourceType,
} from "@/lib/cloudinary";

/**
 * POST /api/ops/learn/upload
 *
 * Returns a signature the browser uses to upload a file directly to
 * Cloudinary. The file never passes through this function.
 *
 * Body: { roadmapSlug, phaseSlug?, stepSlug?, resourceType }
 */
export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const roadmapSlug = String(body.roadmapSlug || "").trim();
  if (!roadmapSlug) {
    return NextResponse.json({ error: "roadmapSlug is required" }, { status: 400 });
  }

  const resourceType = String(body.resourceType || "raw") as CloudinaryResourceType;
  if (!CLOUDINARY_RESOURCE_TYPES.includes(resourceType)) {
    return NextResponse.json(
      { error: `resourceType must be one of: ${CLOUDINARY_RESOURCE_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  const phaseSlug = body.phaseSlug ? String(body.phaseSlug).trim() : null;
  const stepSlug = body.stepSlug ? String(body.stepSlug).trim() : null;
  const folder = buildLearnFolder(roadmapSlug, phaseSlug, stepSlug);
  const timestamp = Math.round(Date.now() / 1000);
  const allowedFormats = CLOUDINARY_ALLOWED_FORMATS[resourceType].join(",");

  // Only these params are signed. Cloudinary deliberately excludes
  // `max_file_size` from the string-to-sign, so it must not be included here.
  const signedParams = {
    folder,
    timestamp,
    allowed_formats: allowedFormats,
  };

  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const signature = signCloudinaryParams(signedParams, apiSecret);

  return NextResponse.json({
    cloudName,
    apiKey,
    signature,
    resourceType,
    uploadUrl: cloudinaryUploadUrl(cloudName, resourceType),
    folder,
    timestamp,
    allowedFormats,
    maxFileBytes: CLOUDINARY_MAX_FILE_BYTES,
  });
}
