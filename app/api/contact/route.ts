import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runAICompletion } from "@/lib/ai";
import { siteConfig } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const id = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // Persist inquiry
    await prisma.inquiry.create({
      data: {
        id,
        name,
        email,
        subject: subject || "General Inquiry",
        message,
        isRead: false,
        responded: false,
      },
    });

    // Autonomous AI Classification & Response Drafting
    try {
      const aiPrompt = `Analyze this incoming inquiry to Joy Chandra Uday (Software Engineer at garirhat.com, Founder of Grow With Owl):
Sender: ${name} <${email}>
Subject: ${subject || "General Inquiry"}
Message:
${message}

Task:
1. Determine category: Choose exactly ONE of: ["Architecture Consulting", "Full-Time Role", "Grow With Owl Collaboration", "Technical Q&A", "General Inquiry"]
2. Draft a professional, courteous, technical email response from Joy Chandra Uday. Keep it warm, concise, and focused on systems/engineering.

Format your output as:
CATEGORY: [chosen category]
---REPLY---
[email reply body]`;

      const aiRes = await runAICompletion({
        prompt: aiPrompt,
        systemPrompt: "You are Joy Chandra Uday's executive inbox copilot. Provide authentic, high-craft, professional responses.",
      });

      if (aiRes.text) {
        const parts = aiRes.text.split(/---REPLY---/);
        let category = "General Inquiry";
        let draft = aiRes.text;

        if (parts.length >= 2) {
          const catMatch = parts[0].match(/CATEGORY:\s*(.+)/i);
          if (catMatch) category = catMatch[1].trim();
          draft = parts[1].trim();
        }

        // Save AI analysis & pre-drafted response
        await prisma.inquiry.update({
          where: { id },
          data: {
            aiCategory: category,
            aiDraft: draft,
          },
        });
      }
    } catch (aiErr) {
      console.warn("Autonomous inbox AI processing failed:", aiErr);
    }

    // Send email via Resend (or Gmail OAuth)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: `Portfolio Inquiry <${siteConfig.email}>`,
            to: siteConfig.email,
            subject: `[Portfolio Inquiry] ${subject || "New Message from " + name}`,
            text: `Sender: ${name} (${email})\n\nMessage:\n${message}\n\nReview & transmit pre-drafted response at https://joychandrauday.vercel.app/ops/inbox`,
          }),
        });
      }
    } catch (mailErr) {
      console.warn("Email notification failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry saved and routed to command hub.",
      persisted: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}