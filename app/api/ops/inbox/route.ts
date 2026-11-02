import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

export async function GET() {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries.map((inq) => ({
      ...inq,
      isRead: Boolean(inq.isRead),
      responded: Boolean(inq.responded),
    })));
  } catch (err) {
    console.error("[api/ops/inbox] read failed:", err);
    return NextResponse.json([], { headers: { "x-db-status": "offline" } });
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, replyText, recipientEmail, recipientName, subject } = await req.json();

    if (!id || !replyText) {
      return NextResponse.json({ error: "Inquiry ID and replyText required" }, { status: 400 });
    }

    // Record that inquiry has been responded to
    await prisma.inquiry.update({
      where: { id },
      data: {
        responded: true,
        isRead: true,
        repliedAt: new Date(),
        aiDraft: replyText,
      },
    });

    // Dispatch email if Resend API key is available
    let emailDispatched = false;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && recipientEmail) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: `Joy Chandra Uday <${siteConfig.email}>`,
            to: recipientEmail,
            subject: subject ? `Re: ${subject}` : `Response from Joy Chandra Uday`,
            text: replyText,
          }),
        });
        emailDispatched = emailRes.ok;
      } catch (mailErr) {
        console.warn("Resend email dispatch error:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      emailDispatched,
      message: emailDispatched
        ? "Response dispatched via email and recorded in ledger."
        : "Response recorded in ledger. Use mailto or add RESEND_API_KEY for direct SMTP dispatch.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, isRead, is_read, responded, aiDraft, ai_draft, aiCategory, ai_category } =
      await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateData: any = {};

    const normalizedIsRead = isRead !== undefined ? isRead : is_read;
    const normalizedDraft = aiDraft !== undefined ? aiDraft : ai_draft;
    const normalizedCategory = aiCategory !== undefined ? aiCategory : ai_category;

    if (normalizedIsRead !== undefined) updateData.isRead = Boolean(normalizedIsRead);
    if (responded !== undefined) updateData.responded = Boolean(responded);
    if (normalizedDraft !== undefined) updateData.aiDraft = normalizedDraft;
    if (normalizedCategory !== undefined) updateData.aiCategory = normalizedCategory;

    await prisma.inquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}