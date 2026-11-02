/**
 * Basic HTML template for inquiry notifications.
 * This keeps the Ops email branding consistent.
 */
export function inquiryTemplate({ name, email, subject, message }: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const safeSubject = subject ?? 'New Inquiry';
  const html = `
    <html>
      <body style="font-family: Inter, sans-serif; color: #e0e0e0; background:#050505; padding:20px;">
        <h2 style="color:#FFB44B;">Portfolio Ops – New Inquiry</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border-color: rgba(255,255,255,0.05);"/>
        <pre style="white-space: pre-wrap; word-wrap: break-word;">${message}</pre>
        <p style="margin-top:20px; font-size:0.9em; color:#888;">
          Sent via Gmail OAuth2 (automated Ops inbox).<br/>
          Review &amp; respond at <a href="https://joychandrauday.vercel.app/ops/inbox" style="color:#FFB44B;">Ops Inbox</a>
        </p>
      </body>
    </html>`;
  const text = `Portfolio Ops – New Inquiry\nFrom: ${name} <${email}>\nSubject: ${safeSubject}\n\n${message}\n\nReview & respond at https://joychandrauday.vercel.app/ops/inbox`;
  return { subject: `[Portfolio Inquiry] ${safeSubject}`, html, text };
}
