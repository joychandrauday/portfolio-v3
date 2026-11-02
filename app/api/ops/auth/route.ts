import { NextRequest, NextResponse } from "next/server";
import { createOpsSession, clearOpsSession, verifyOpsSession, DEFAULT_OPS_PASSWORD } from "@/lib/auth";

export async function GET() {
  const isAuthed = await verifyOpsSession();
  return NextResponse.json({ authenticated: isAuthed });
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.OPS_ADMIN_PASSWORD || DEFAULT_OPS_PASSWORD;

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid operational access key" },
        { status: 401 }
      );
    }

    await createOpsSession();
    return NextResponse.json({ success: true, message: "Ops session established" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearOpsSession();
  return NextResponse.json({ success: true, message: "Ops session terminated" });
}