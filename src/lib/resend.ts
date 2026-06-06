import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

export const isResendConfigured = !!resendApiKey;

export const resend = isResendConfigured ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Kimia Events Team <noreply@kimiaeventsteam.com>",
}: SendEmailParams) {
  if (isResendConfigured && resend) {
    try {
      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
      return { success: true, data: response };
    } catch (error) {
      console.error("Resend API failed, falling back to console logger:", error);
    }
  }

  // Graceful fallback for development
  console.log("==================================================");
  console.log(`[MOCK EMAIL SENT]`);
  console.log(`From:    ${from}`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`HTML:    (Visual representation of content)`);
  console.log(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 200) + "...");
  console.log("==================================================");

  return { success: true, mock: true };
}
