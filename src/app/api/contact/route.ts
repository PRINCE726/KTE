import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${validatedData.nom}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Sujet:</strong> ${validatedData.sujet}</p>
        <p><strong>Message:</strong><br/>${validatedData.message}</p>
      </div>
    `;

    await sendEmail({
      to: "kimiapriméevents@gmail.com",
      from: "KTE <noreply@kimiaevents.com>",
      subject: `Contact KTE - ${validatedData.sujet}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API Route Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'envoi du message." }, { status: 500 });
  }
}
