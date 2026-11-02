// lib/mail.ts — Gmail OAuth2 email helper with Prisma logging
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

function getGmailTransport() {
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
  const GMAIL_USER = process.env.GMAIL_USER;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
    throw new Error("Gmail credentials are not fully set in environment variables.");
  }

  const oauth2 = {
    type: "OAuth2" as const,
    user: GMAIL_USER,
    clientId: GMAIL_CLIENT_ID,
    clientSecret: GMAIL_CLIENT_SECRET,
    refreshToken: GMAIL_REFRESH_TOKEN,
  };

  return nodemailer.createTransport({
    service: "gmail",
    auth: oauth2,
  });
}

export async function sendMail({
  to,
  subject,
  text,
  html,
  attachments,
  jobId,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; path: string }[];
  jobId?: string;
}): Promise<void> {
  const transporter = getGmailTransport();
  const maxRetries = 3;
  let attempt = 0;

  const send = async () => {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    });
  };

  while (attempt <= maxRetries) {
    try {
      await send();
      // Log successful email
      await prisma.email.create({
        data: {
          id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          jobId: jobId || null,
          to,
          subject,
          body: html ?? text ?? "",
          status: "sent",
          sentAt: new Date(),
        },
      });
      return;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        // Log failure after final attempt
        await prisma.email.create({
          data: {
            id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            jobId: jobId || null,
            to,
            subject,
            body: html ?? text ?? "",
            status: "failed",
            errorMessage: (err as any).message ?? String(err),
          },
        });
        throw err;
      }
      // Exponential backoff: 500ms, 1s, 2s
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }
  }
}