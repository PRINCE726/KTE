import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/resend";
import { inscriptionGalaSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = inscriptionGalaSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    const record = {
      nom: validatedData.nom,
      email: validatedData.email,
      telephone: validatedData.telephone,
      type_pass: validatedData.pass,
      lycee: validatedData.lycee,
      statut: "en_attente",
    };

    const { data, error } = await supabase
      .from("inscriptions_gala")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <p>Bonjour ${validatedData.nom},</p>
        <p>Ta place au Gala des Bacheliers est confirmée !</p>
        <p>Pass: ${validatedData.pass}</p>
        <p>Date: Juin 2026</p>
        <p>Lieu: Pointe-Noire, Congo</p>
        <p>Pour toute question:<br>+242 05 328 7181</p>
        <p>L'équipe KTE</p>
      </div>
    `;

    await sendEmail({
      to: validatedData.email,
      from: "KTE <noreply@kimiaevents.com>",
      subject: "Confirmation - Pass Gala KTE",
      html: emailHtml,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("Gala API Route Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription." }, { status: 500 });
  }
}
