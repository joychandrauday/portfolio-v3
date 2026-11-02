import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { siteConfig } from "@/lib/data";

/**
 * POST /api/ops/jobs/apply
 *
 * Sends an application email from the CRM and advances the pipeline.
 * Body: { jobId, to?, subject, body, send?: boolean, tone? }
 *
 * Delivery order: Resend -> Gmail OAuth (nodemailer) -> ledger only.
 */
export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jobId, to, subject, body, send = true } = await req.json();

    if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }
    if (String(body).trim().length < 40) {
      return NextResponse.json({ error: "Email body looks too short to send" }, { status: 400 });
    }

    const job = await prisma.jobApplication.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const recipient = String(to || job.contactEmail || "").trim();

    if (send && !recipient) {
      return NextResponse.json(
        { error: "No recipient email. Add a contact email or save the draft only." },
        { status: 400 }
      );
    }

    const now = new Date();
    const nextAction = new Date(now);
    nextAction.setDate(nextAction.getDate() + 5);

    let emailDispatched = false;
    let deliveryChannel = "ledger";
    let deliveryError: string | null = null;

    // ── 1. Resend ──────────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (send && recipient && resendKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: `Joy Chandra Uday <${siteConfig.email}>`,
            to: recipient,
            subject,
            text: body,
            reply_to: siteConfig.email,
          }),
        });

        if (emailRes.ok) {
          emailDispatched = true;
          deliveryChannel = "resend";
        } else {
          deliveryError = `Resend responded ${emailRes.status}`;
        }
      } catch (err: any) {
        deliveryError = err?.message || "Resend dispatch failed";
      }
    }

    // ── 2. Gmail OAuth fallback ────────────────────────────────────────
    if (send && recipient && !emailDispatched) {
      const gmailReady = Boolean(
        process.env.GMAIL_CLIENT_ID &&
          process.env.GMAIL_CLIENT_SECRET &&
          process.env.GMAIL_REFRESH_TOKEN &&
          process.env.GMAIL_USER &&
          !process.env.GMAIL_REFRESH_TOKEN.includes("REPLACE")
      );

      if (gmailReady) {
        try {
          await sendMail({ to: recipient, subject, text: body, jobId: job.id });
          emailDispatched = true;
          deliveryChannel = "gmail";
        } catch (err: any) {
          deliveryError = err?.message || "Gmail dispatch failed";
        }
      } else if (!deliveryError) {
        deliveryError = "No mail provider configured (set RESEND_API_KEY or Gmail OAuth vars)";
      }
    }

    // ── 3. Ledger entry (Gmail already wrote its own row) ─────────────
    if (deliveryChannel !== "gmail") {
      await prisma.email.create({
        data: {
          id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          jobId: job.id,
          to: recipient || "(no recipient)",
          subject,
          body,
          status: emailDispatched ? "sent" : "draft",
          errorMessage: emailDispatched ? null : deliveryError,
          sentAt: emailDispatched ? now : null,
        },
      });
    }

    // ── 4. Pipeline automation ─────────────────────────────────────────
    const updated = await prisma.jobApplication.update({
      where: { id: job.id },
      data: {
        contactEmail: job.contactEmail || recipient || null,
        coverLetter: body,
        status: job.status === "wishlist" ? "applied" : job.status,
        appliedAt: job.appliedAt ?? (send ? now : job.appliedAt),
        lastContactedAt: send ? now : job.lastContactedAt,
        nextActionAt: send ? nextAction : job.nextActionAt,
        followUpAt: send ? nextAction : job.followUpAt,
      },
    });

    return NextResponse.json({
      success: true,
      emailDispatched,
      deliveryChannel,
      error: deliveryError,
      job: updated,
      message: emailDispatched
        ? `Application email sent to ${recipient} via ${deliveryChannel}. Pipeline moved to Applied.`
        : `Draft saved to the ledger. ${deliveryError ?? "Connect a mail provider to send directly."}`,
    });
  } catch (err: any) {
    console.error("[api/ops/jobs/apply] failed:", err);
    return NextResponse.json({ error: err.message || "Apply failed" }, { status: 500 });
  }
}
