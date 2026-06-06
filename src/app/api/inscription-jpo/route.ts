import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/resend";
import { inscriptionJPOSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = inscriptionJPOSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // Note: checking available spots could involve querying the count of existing inscriptions
    // For now we just insert
    const record = {
      nom: validatedData.nom,
      email: validatedData.email,
      telephone: validatedData.telephone,
      pole: validatedData.pole,
      session: validatedData.session,
      lycee: validatedData.lycee,
      classe: validatedData.classe,
      source: validatedData.source,
      statut: "en_attente",
    };

    const { data, error } = await supabase
      .from("inscriptions_jpo")
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
        <p>Ton inscription à la Journée Portes Ouvertes est confirmée !</p>
        <p>Pôle: ${validatedData.pole}</p>
        <p>Session: ${validatedData.session}</p>
        <p>Date: Avril-Mai 2026</p>
        <p>L'équipe KTE te contactera bientôt avec plus de détails.</p>
        <p>Pour toute question:<br>+242 05 328 7181</p>
        <p>L'équipe KTE</p>
      </div>
    `;

    await sendEmail({
      to: validatedData.email,
      from: "KTE <noreply@kimiaevents.com>",
      subject: `Confirmation - JPO ${validatedData.pole} KTE`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("JPO API Route Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription." }, { status: 500 });
  }
}
